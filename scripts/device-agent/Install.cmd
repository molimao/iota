@echo off
py -3 -c "import sys; sys.exit(sys.version_info < (3, 11))" >nul 2>&1
if errorlevel 1 goto try_python
py -3 "%~dp0windows_agent.py" install
goto finish

:try_python
python -c "import sys; sys.exit(sys.version_info < (3, 11))" >nul 2>&1
if errorlevel 1 goto missing
python "%~dp0windows_agent.py" install
goto finish

:missing
echo Install Python 3.11 or later for Windows from https://www.python.org/downloads/windows/
echo Then run Install.cmd again.

:finish
pause
