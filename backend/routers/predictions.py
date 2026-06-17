from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserBehavior, PredictionResult
from schemas import PredictionOut
from auth import get_current_user
from ml.scorer import score_behavior, classify_segment

router = APIRouter(prefix="/predictions", tags=["predictions"])

@router.post("/score/{behavior_id}", response_model=PredictionOut, status_code=201)
def score(behavior_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    b = db.query(UserBehavior).filter(UserBehavior.id == behavior_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Behavior record not found")
    probability, weights = score_behavior(
        page_views=b.page_views,
        session_duration=b.session_duration,
        clicks=b.clicks,
        email_opens=b.email_opens,
        purchases=b.purchases,
        cart_adds=b.cart_adds,
        search_queries=b.search_queries,
        days_since_last_visit=b.days_since_last_visit,
    )
    segment = classify_segment(probability)
    result = PredictionResult(
        user_id=b.user_id,
        behavior_id=b.id,
        score=probability,
        segment=segment,
        feature_weights=weights,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

@router.get("/", response_model=List[PredictionOut])
def list_predictions(user_id: Optional[int] = None, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    q = db.query(PredictionResult)
    if user_id:
        q = q.filter(PredictionResult.user_id == user_id)
    return q.order_by(PredictionResult.predicted_at.desc()).all()

@router.get("/{prediction_id}", response_model=PredictionOut)
def get_prediction(prediction_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    p = db.query(PredictionResult).filter(PredictionResult.id == prediction_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return p
