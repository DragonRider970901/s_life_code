import sys
import pandas as pd
import numpy as np
import json
from scipy.stats import chi2_contingency, f_oneway
from sklearn.preprocessing import OneHotEncoder
from sklearn.decomposition import PCA



# Read path from argument
if len(sys.argv) < 2:
    print(json.dumps({"error": "Missing CSV path"}))
    sys.exit(1)

csv_path = sys.argv[1]
df = pd.read_csv(csv_path)

# Interpret 0 values where needed
df["user_personality_type"] = df["user_personality_type"].astype(str)

### Helper: Cramér’s V
def cramers_v(confusion_matrix):
    chi2 = chi2_contingency(confusion_matrix)[0]
    n = confusion_matrix.sum().sum()
    phi2 = chi2 / n
    r, k = confusion_matrix.shape
    phi2corr = max(0, phi2 - ((k - 1) * (r - 1)) / (n - 1))
    rcorr = r - ((r - 1) ** 2) / (n - 1)
    kcorr = k - ((k - 1) ** 2) / (n - 1)
    return np.sqrt(phi2corr / min((kcorr - 1), (rcorr - 1)))

def get_cramers_v(var_name):
    ct = pd.crosstab(df["user_personality_type"], df[var_name])
    return cramers_v(ct)

def get_anova(var_name):
    groups = [group["user_age"].values for _, group in df.groupby("user_personality_type") if 0 not in group["user_age"].values]
    f_stat, p_value = f_oneway(*groups)
    return {"F": f_stat, "p": p_value}

# Run analysis
results = {
    "cramersV": {
        "user_gender": get_cramers_v("user_gender"),
        "user_body_type": get_cramers_v("user_body_type"),
        "user_parents_status": get_cramers_v("user_parents_status"),
        "hair_length": get_cramers_v("hair_length"),
        "unusual_hairstyle": get_cramers_v("unusual_hairstyle"),
        "appearance": get_cramers_v("appearance"),
        "unusual_appearance": get_cramers_v("unusual_appearance"),
    },
    "anova": get_anova("user_age")
}

# Gender vs Personality Chi-Square Test + Distribution
gender_table = pd.crosstab(df["user_personality_type"], df["user_gender"])
chi2, p_val, _, _ = chi2_contingency(gender_table)
gender_distribution = gender_table.T.to_dict()

results["gender_analysis"] = {
    "chi2": chi2,
    "p_value": p_val,
    "distribution": gender_distribution
}

# Boxplot-style age distribution per personality
boxplot_data = {}
grouped = df[df["user_age"] > 0].groupby("user_personality_type")["user_age"]

for personality, ages in grouped:
    desc = ages.describe(percentiles=[.25, .5, .75])
    boxplot_data[personality] = {
        "min": desc["min"],
        "q1": desc["25%"],
        "median": desc["50%"],
        "q3": desc["75%"],
        "max": desc["max"]
    }

results["age_boxplot"] = boxplot_data

# Body Type vs Personality distribution + Cramér's V
body_type_table = df.groupby(["user_personality_type", "user_body_type"]).size().unstack(fill_value=0)
body_type_distribution = body_type_table.T.to_dict()

results["body_type_analysis"] = {
    "distribution": body_type_distribution,
    "cramers_v": get_cramers_v("user_body_type")
}


# Hair length distribution + Cramér’s V + Chi-Square
hair_length_table = pd.crosstab(df["user_personality_type"], df["hair_length"])
chi2_hair, p_hair, _, _ = chi2_contingency(hair_length_table)
hair_length_distribution = hair_length_table.T.to_dict()

results["hair_length_analysis"] = {
    "distribution": hair_length_distribution,
    "cramers_v": get_cramers_v("hair_length"),
    "chi2": chi2_hair,
    "p_value": p_hair
}


# Hair length vs gender
hl_gender_table = pd.crosstab(df["user_gender"], df["hair_length"])
chi2_hg, p_hg, _, _ = chi2_contingency(hl_gender_table)
hl_gender_distribution = hl_gender_table.T.to_dict()

results["hair_gender_analysis"] = {
    "distribution": hl_gender_distribution,
    "cramers_v": get_cramers_v("hair_length"),
    "chi2": chi2_hg,
    "p_value": p_hg
}


# Hair Length vs Personality Type and Gender (3D breakdown)
hair_len_combo = {}

grouped = df.groupby(["user_personality_type", "user_gender", "hair_length"]).size()

for (ptype, gender, length), count in grouped.items():
    key = f"{ptype}_{gender}"  # e.g., "12_2"
    if key not in hair_len_combo:
        hair_len_combo[key] = {}
    hair_len_combo[key][length] = count

results["hair_length_by_type_gender"] = hair_len_combo


# Unusual Hairstyle by personality
uh_table = pd.crosstab(df["user_personality_type"], df["unusual_hairstyle"])
uh_distribution = uh_table.T.to_dict()

results["unusual_hairstyle_analysis"] = {
    "distribution": uh_distribution,
    "cramers_v": get_cramers_v("unusual_hairstyle")
}

# Unusual Appearance by personality
ua_table = pd.crosstab(df["user_personality_type"], df["unusual_appearance"])
ua_distribution = ua_table.T.to_dict()

results["unusual_appearance_analysis"] = {
    "distribution": ua_distribution,
    "cramers_v": get_cramers_v("unusual_appearance")
}


# Appearance vs Personality Type (stacked bar + Cramér's V)
appearance_table = pd.crosstab(df["user_personality_type"], df["appearance"])
appearance_distribution = appearance_table.T.to_dict()

results["appearance_analysis"] = {
    "distribution": appearance_distribution,
    "cramers_v": get_cramers_v("appearance")
}


# Dimensionality Reduction (PCA for 2D clustering)
features = [
    "user_gender",
    "user_parents_status",
    "user_body_type",
    "hair_length",
    "unusual_hairstyle",
    "appearance",
    "unusual_appearance"
]

# Filter out rows with missing or zero values
reduced_df = df.copy()
reduced_df = reduced_df[(reduced_df["user_age"] > 0) & (reduced_df["user_body_type"] > 0)]

X = reduced_df[features].astype(int)
y = reduced_df["user_personality_type"]

encoder = OneHotEncoder(sparse_output=False)

X_encoded = encoder.fit_transform(X)

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_encoded)

# Package as list of dicts for frontend
pca_points = []
for i in range(len(X_pca)):
    pca_points.append({
        "x": X_pca[i][0],
        "y": X_pca[i][1],
        "type": y.iloc[i]
    })

results["pca_projection"] = pca_points




print(json.dumps(results))
