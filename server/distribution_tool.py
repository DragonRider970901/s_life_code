from sqlalchemy import create_engine
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
import json

# Load parameters from CLI
if len(sys.argv) < 3:
    print(json.dumps({"error": "Missing arguments"}))
    sys.exit(1)

survey_id = sys.argv[1]
question_id = sys.argv[2]

# Database connection settings
user = 'root'
password = ''
host = 'localhost'
port = 3306
database = 's_life_code'

# Create SQLAlchemy engine
engine = create_engine(f'mysql+pymysql://{user}:{password}@{host}:{port}/{database}')

# SQL query
query = """
SELECT sr.answer_text AS answer, tr.result->>'$.type' AS personality
FROM survey_responses r
JOIN survey_answers sr ON r.id = sr.response_id
JOIN test_results tr ON r.user_id = tr.user_id
WHERE r.survey_id = %s AND sr.question_id = %s
"""

# Read into DataFrame
df = pd.read_sql(query, engine, params=(survey_id, question_id))


# Generate count plot
plt.figure(figsize=(12, 6))
sns.countplot(data=df, x='answer', hue='personality')
plt.title('Distribution of Answers by Personality Type')
plt.xticks(rotation=45)
plt.tight_layout()

# Save the plot
output_dir = os.path.join(os.path.dirname(__file__), 'exports')
os.makedirs(output_dir, exist_ok=True)
plot_path = os.path.join(output_dir, f'distribution_{survey_id}_{question_id}.png')
plt.savefig(plot_path)

# Return path as JSON
print(json.dumps({"image": f"/exports/distribution_{survey_id}_{question_id}.png"}))
