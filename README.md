# NeoCalc — Modern Responsive Calculator

A sleek, responsive web calculator application built with a tactile neumorphic/glassmorphic interface, real-time expression preview, physical keyboard support, and persistent calculation history powered by a FastAPI backend and SQLite database.

---

## 📸 Overview & Architecture

```text
React (Vite + Tailwind CSS)  <──HTTP/JSON──>  FastAPI Backend  <──>  SQLite Database
         │                                            │
  Tactile Neumorphism                           Safe AST Parser
  Keyboard Listeners                         Precedence & Validation
  Live Expression Preview                     History Persistence
```

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Web Audio API.
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic, SQLite3, Pytest.
- **Security**: Abstract Syntax Tree (AST) parsing with strict token validation (no unrestricted `eval()`).

---

## 🚀 Key Features

1. **Four Basic Arithmetic Operations**: Addition (`+`), Subtraction (`−`), Multiplication (`×`), Division (`÷`).
2. **Standard Operator Precedence**: Evaluates expressions using standard mathematical precedence (e.g., `2 + 3 * 4 = 14`).
3. **Decimal Calculations**: Proper floating-point handling without IEEE-754 precision artifacts (`0.1 + 0.2 = 0.3`, `5.5 + 2.5 = 8`).
4. **Live Expression Preview**: Displays a faint real-time preview of the result as the user types before pressing `=`.
5. **Persistent History**: Stores successful calculations in SQLite database. Records are displayed in reverse chronological order and persist across reloads.
6. **Reuse History**: Click any previous calculation to load its expression or inject its result into the active calculation.
7. **Clear All (AC) & Backspace (⌫)**: Full reset and individual character deletion.
8. **Physical Keyboard Support**:
   - `0–9`: Enter digits
   - `+`, `-`, `*` or `x`, `/`: Operators
   - `.`: Decimal point
   - `Enter` or `=`: Evaluate expression
   - `Backspace`: Delete last character
   - `Escape`: Clear all (AC)
   - `%`: Percentage
9. **Interactive States & Haptic Audio**: Press feedback for both mouse and physical keyboard input, with toggleable tactile audio feedback.
10. **Light & Dark Themes**: Persistent theme switcher with custom neumorphic lighting, glowing radiant orange operator keys, and ambient background illumination.
11. **Comprehensive Error Handling**: Clear messages for division by zero (`Cannot divide by zero`), incomplete expressions (`8+`), and malformed inputs.

---

## 🛠️ Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

---

### 1. Backend Setup (FastAPI + SQLite)

Open a terminal and navigate to the backend directory:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

The backend will be running at `http://localhost:8000`.
- Interactive API Docs (Swagger): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

---

### 2. Frontend Setup (React + Vite)

In a new terminal window, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

A comprehensive test suite is included in `backend/test_calculator.py` covering all arithmetic operations, operator precedence, decimal formatting, division by zero, invalid sequences, code injection prevention, and history persistence:

```bash
source backend/venv/bin/activate
pytest backend/test_calculator.py -v
```

---

## 📦 Production Build

To build the optimized static assets for the React frontend:

```bash
cd frontend
npm run build
```

Built assets are generated in `frontend/dist/`.

---

## 📡 REST API Documentation

### 1. Calculate Expression
- **Endpoint**: `POST /api/calculate`
- **Request Body**:
  ```json
  {
    "expression": "12+8*2"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "expression": "12+8*2",
    "result": 28
  }
  ```
- **Division by Zero (`400 Bad Request`)**:
  ```json
  {
    "detail": "Cannot divide by zero"
  }
  ```
- **Validation Error (`422 Unprocessable Entity`)**:
  ```json
  {
    "detail": "Invalid mathematical expression"
  }
  ```

### 2. Retrieve History
- **Endpoint**: `GET /api/history`
- **Response (`200 OK`)**:
  ```json
  {
    "history": [
      {
        "id": 1,
        "expression": "12+8*2",
        "result": 28,
        "timestamp": "2026-10-19T10:30:00"
      }
    ]
  }
  ```

### 3. Clear History
- **Endpoint**: `DELETE /api/history`
- **Response (`200 OK`)**:
  ```json
  {
    "message": "Calculation history cleared successfully"
  }
  ```
