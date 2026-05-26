"""Aggregates per-week content modules into a single register_all(C, R)."""

from topic_content import week1, week2, week3, week4, week5


def register_all(C, R):
    week1.register(C, R)
    week2.register(C, R)
    week3.register(C, R)
    week4.register(C, R)
    week5.register(C, R)
