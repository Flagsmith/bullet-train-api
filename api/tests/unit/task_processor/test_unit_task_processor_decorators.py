import logging

from task_processor.decorators import register_task_handler


def test_register_task_handler_run_in_thread(mocker, caplog):
    # Given
    # caplog doesn't allow you to capture logging outputs from loggers that don't
    # propagate to root. Quick hack here to get the task_processor logger to
    # propagate.
    # TODO: look into using loguru.
    task_processor_logger = logging.getLogger("task_processor")
    task_processor_logger.propagate = True
    caplog.set_level(logging.INFO)

    @register_task_handler()
    def my_function(*args, **kwargs):
        pass

    mock_thread = mocker.MagicMock()
    mock_thread_class = mocker.patch(
        "task_processor.decorators.Thread", return_value=mock_thread
    )

    args = ("foo",)
    kwargs = {"bar": "baz"}

    # When
    my_function.run_in_thread(*args, **kwargs)

    # Then
    mock_thread_class.assert_called_once_with(
        target=my_function, args=args, kwargs=kwargs, daemon=True
    )
    mock_thread.start.assert_called_once()

    assert len(caplog.records) == 1
    assert (
        caplog.records[0].message == "Running function my_function in unmanaged thread."
    )
