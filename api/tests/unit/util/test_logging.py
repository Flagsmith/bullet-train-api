import json
import logging
import os

import pytest

from util.logging import JsonFormatter


@pytest.fixture
def inspecting_handler() -> logging.Handler:
    class InspectingHandler(logging.Handler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.messages = []

        def handle(self, record):
            self.messages.append(self.format(record))

    return InspectingHandler()


@pytest.mark.freeze_time("2023-12-08T06:05:47.320000+00:00")
def test_json_formatter__outputs_expected(inspecting_handler: logging.Handler) -> None:
    # Given
    json_formatter = JsonFormatter()

    inspecting_handler.setFormatter(json_formatter)
    logger = logging.getLogger("test_json_formatter__outputs_expected")
    logger.addHandler(inspecting_handler)
    logger.setLevel(logging.INFO)

    expected_pid = os.getpid()
    expected_tb_string = (
        "Traceback (most recent call last):\n"
        '  File "/Users/kgustyr/dev/flagsmith/flagsmith/api/tests/unit/util/test_logging.py",'
        " line 43, in _log_traceback\n"
        "    raise Exception()\nException"
    )

    def _log_traceback() -> None:
        try:
            raise Exception()
        except Exception as exc:
            logger.error("this is an error", exc_info=exc)

    # When
    logger.info("hello")
    _log_traceback()

    # Then
    assert [json.loads(message) for message in inspecting_handler.messages] == [
        {
            "levelname": "INFO",
            "message": "hello",
            "timestamp": "2023-12-08 06:05:47,319",
            "logger_name": "test_json_formatter__outputs_expected",
            "process_id": expected_pid,
            "thread_name": "MainThread",
        },
        {
            "levelname": "ERROR",
            "message": "this is an error",
            "timestamp": "2023-12-08 06:05:47,319",
            "logger_name": "test_json_formatter__outputs_expected",
            "process_id": expected_pid,
            "thread_name": "MainThread",
            "exc_info": expected_tb_string,
        },
    ]
