import ast
import re
from typing import Union


def normalize_expression(expr: str) -> str:
    """
    Normalizes symbols and validates basic syntax.
    Replaces unicode symbols like ×, ÷, − with *, /, -.
    Normalizes leading decimals like .5 to 0.5.
    """
    if not expr or not expr.strip():
        raise ValueError("Invalid mathematical expression")

    # Replace display symbols
    normalized = expr.strip()
    normalized = normalized.replace("×", "*").replace("÷", "/").replace("−", "-")

    # Disallow unsupported characters (only digits, operators, parentheses, decimal point, whitespace)
    if not re.fullmatch(r"^[0-9+\-*/().\s]+$", normalized):
        raise ValueError("Invalid mathematical expression")

    # Disallow consecutive operators (e.g. 5++3, 5+*3, 5--3, 5*/3)
    # Check for consecutive operators, allowing an optional space between them
    if re.search(r"[+\-*/]{2,}", normalized.replace(" ", "")):
        raise ValueError("Invalid mathematical expression")

    # Disallow expressions ending with an operator
    stripped_no_spaces = normalized.replace(" ", "")
    if stripped_no_spaces[-1] in "+-*/.":
        raise ValueError("Invalid mathematical expression")

    # Disallow expressions starting with * or /
    if stripped_no_spaces[0] in "*/.":
        raise ValueError("Invalid mathematical expression")

    # Validate numbers do not have multiple decimal points, e.g. 1.2.3
    # Extract number tokens
    tokens = re.split(r"[+\-*/()\s]+", normalized)
    for token in tokens:
        if token and token.count(".") > 1:
            raise ValueError("Invalid mathematical expression")

    # Normalize decimal points without leading 0 (e.g. .5 -> 0.5, +.5 -> +0.5)
    # Replace any .digit not preceded by a digit
    normalized = re.sub(r"(?<!\d)\.(\d+)", r"0.\1", normalized)

    return normalized


def evaluate_ast(node) -> Union[int, float]:
    """
    Safely evaluates an AST node containing only basic arithmetic operations.
    Raises ZeroDivisionError or ValueError on invalid operations.
    """
    if isinstance(node, ast.Expression):
        return evaluate_ast(node.body)

    elif isinstance(node, ast.BinOp):
        left = evaluate_ast(node.left)
        right = evaluate_ast(node.right)

        if isinstance(node.op, ast.Add):
            return left + right
        elif isinstance(node.op, ast.Sub):
            return left - right
        elif isinstance(node.op, ast.Mult):
            return left * right
        elif isinstance(node.op, ast.Div):
            if right == 0:
                raise ZeroDivisionError("Cannot divide by zero")
            return left / right
        else:
            raise ValueError("Invalid mathematical expression")

    elif isinstance(node, ast.UnaryOp):
        operand = evaluate_ast(node.operand)
        if isinstance(node.op, ast.USub):
            return -operand
        elif isinstance(node.op, ast.UAdd):
            return +operand
        else:
            raise ValueError("Invalid mathematical expression")

    elif isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError("Invalid mathematical expression")

    else:
        raise ValueError("Invalid mathematical expression")


def calculate(expression: str) -> Union[int, float]:
    """
    Validates and calculates the result of a mathematical expression.
    Returns int if the result is an integer, or clean float.
    """
    if len(expression) > 100:
        raise ValueError("Expression exceeds maximum length of 100 characters")

    normalized = normalize_expression(expression)

    try:
        parsed = ast.parse(normalized, mode="eval")
    except SyntaxError:
        raise ValueError("Invalid mathematical expression")

    raw_result = evaluate_ast(parsed)

    # Clean floating point representation
    # Round to 10 decimal places to eliminate IEEE-754 precision artifacts like 0.1+0.2
    if isinstance(raw_result, float):
        rounded = round(raw_result, 10)
        if rounded.is_integer():
            return int(rounded)
        return rounded
    elif isinstance(raw_result, int):
        return raw_result
    else:
        raise ValueError("Invalid mathematical expression")
