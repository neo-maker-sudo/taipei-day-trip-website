import re

content = "0912345678"
pattern = r"^09[0-9]{8}$"
result = re.match(pattern, content)
print(result)
