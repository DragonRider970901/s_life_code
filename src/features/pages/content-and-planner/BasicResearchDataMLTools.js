import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend, ScatterChart, Scatter
} from "recharts";
import { getType } from "../../../utils/personalityUtilsFrontend";


import "../../../style/dektop/basic-research-data-ml-tools.css";

export default function BasicResearchDataMLTools() {
    const [chartData, setChartData] = useState([]);
    const [anova, setAnova] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [genderStats, setGenderStats] = useState(null);
    const [genderDist, setGenderDist] = useState([]);
    const [ageBox, setAgeBox] = useState([]);
    const [bodyDist, setBodyDist] = useState([]);
    const [bodyCramersV, setBodyCramersV] = useState(null);
    const [hairDist, setHairDist] = useState([]);
    const [hairStats, setHairStats] = useState(null);
    const [hairGenderDist, setHairGenderDist] = useState([]);
    const [hairGenderStats, setHairGenderStats] = useState(null);
    const [hairComboDist, setHairComboDist] = useState([]);
    const [unusualHair, setUnusualHair] = useState([]);
    const [unusualAppearance, setUnusualAppearance] = useState([]);
    const [uhCramersV, setUhCramersV] = useState(null);
    const [uaCramersV, setUaCramersV] = useState(null);
    const [appearanceDist, setAppearanceDist] = useState([]);
    const [appearanceV, setAppearanceV] = useState(null);
    const [pcaPoints, setPcaPoints] = useState([]);
    const [fileName, setFileName] = useState("");









    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data;

                setLoading(true);
                
                axios.post(`${process.env.REACT_APP_API_URL}/ml/analyze`, { data: parsedData })
                    .then((res) => {
                        const genderResults = res.data.gender_analysis || {};
                        const dist = genderResults.distribution || {};

                        const formatted = Object.keys(dist).map(type => ({
                            personality: `${getType(type)}`,
                            male: dist[type]["1"] || 0,
                            female: dist[type]["2"] || 0,
                            unspecified: dist[type]["0"] || 0
                        }));

                        setGenderDist(formatted);
                        setGenderStats({
                            chi2: genderResults.chi2,
                            p: genderResults.p_value
                        });

                        const box = res.data.age_boxplot || {};
                        const ageFormatted = Object.entries(box).map(([type, values]) => ({
                            personality: `${getType(type)}`,
                            min: values.min,
                            q1: values.q1,
                            median: values.median,
                            q3: values.q3,
                            max: values.max
                        }));
                        setAgeBox(ageFormatted);

                        setAnova(res.data.anova);

                        const bodyResults = res.data.body_type_analysis || {};
                        const bodyDistRaw = bodyResults.distribution || {};

                        const formattedBodyDist = Object.keys(bodyDistRaw).map(type => {
                            const entry = { personality: getType(type) };
                            for (let i = 1; i <= 10; i++) {
                                entry[`type_${i}`] = bodyDistRaw[type][i] || 0;
                            }
                            return entry;
                        });

                        setBodyDist(formattedBodyDist);
                        setBodyCramersV(bodyResults.cramers_v);

                        const hairResults = res.data.hair_length_analysis || {};
                        const hairDistRaw = hairResults.distribution || {};

                        const formattedHairDist = Object.keys(hairDistRaw).map(type => {
                            const entry = { personality: getType(type) };
                            for (let i = 1; i <= 6; i++) {
                                entry[`length_${i}`] = hairDistRaw[type][i] || 0;
                            }
                            return entry;
                        });

                        setHairDist(formattedHairDist);
                        setHairStats({
                            cramersV: hairResults.cramers_v,
                            chi2: hairResults.chi2,
                            p: hairResults.p_value
                        });

                        const hlGenderResults = res.data.hair_gender_analysis || {};
                        const hlGenderRaw = hlGenderResults.distribution || {};

                        const formattedHLGender = Object.keys(hlGenderRaw).map(gender => {
                            const entry = { gender: gender === "1" ? "Male" : gender === "2" ? "Female" : "Unspecified" };
                            for (let i = 1; i <= 6; i++) {
                                entry[`length_${i}`] = hlGenderRaw[gender][i] || 0;
                            }
                            return entry;
                        });

                        setHairGenderDist(formattedHLGender);
                        setHairGenderStats({
                            cramersV: hlGenderResults.cramers_v,
                            chi2: hlGenderResults.chi2,
                            p: hlGenderResults.p_value
                        });
                        const combo = res.data.hair_length_by_type_gender || {};

                        const formattedCombo = Object.entries(combo).map(([key, lengths]) => {
                            const [type, gender] = key.split("_");
                            const entry = {
                                label: `${getType(type)} (${gender === "1" ? "M" : gender === "2" ? "F" : "U"})`
                            };
                            for (let i = 1; i <= 6; i++) {
                                entry[`length_${i}`] = lengths[i] || 0;
                            }
                            return entry;
                        });

                        setHairComboDist(formattedCombo);

                        // Unusual Hairstyle
                        const uhResults = res.data.unusual_hairstyle_analysis || {};
                        const uhRaw = uhResults.distribution || {};

                        const formattedUH = Object.entries(uhRaw).map(([type, values]) => ({
                            personality: getType(type),
                            true: values[0] || 0,
                            false: values[1] || 0
                        }));
                        setUnusualHair(formattedUH);
                        setUhCramersV(uhResults.cramers_v);

                        // Unusual Appearance
                        const uaResults = res.data.unusual_appearance_analysis || {};
                        const uaRaw = uaResults.distribution || {};

                        const formattedUA = Object.entries(uaRaw).map(([type, values]) => ({
                            personality: getType(type),
                            true: values[0] || 0,
                            false: values[1] || 0
                        }));
                        setUnusualAppearance(formattedUA);
                        setUaCramersV(uaResults.cramers_v);

                        const appResults = res.data.appearance_analysis || {};
                        const appRaw = appResults.distribution || {};

                        const formattedAppearance = Object.entries(appRaw).map(([type, values]) => ({
                            personality: getType(type),
                            neat: values[0] || 0,
                            slightly_messy: values[1] || 0,
                            messy: values[2] || 0,
                            neutral: values[4] || 0
                        }));
                        setAppearanceDist(formattedAppearance);
                        setAppearanceV(appResults.cramers_v);


                        const pcaData = res.data.pca_projection || [];
                        const formattedPCA = pcaData.map(p => ({
                            x: p.x,
                            y: p.y,
                            type: getType(p.type)
                        }));
                        setPcaPoints(formattedPCA);






                    })
                    .catch((err) => {
                        console.error(err);
                        setError("Failed to analyze data.");
                    })
                    .finally(() => setLoading(false));
            },
            error: (err) => {
                console.error(err);
                setError("Failed to parse CSV.");
            }
        });
    };

    return (
        <div style={{ padding: "20px" }} className="basic-research-data-ml-tools">
            <h3>Basic Research Data ML Tools</h3>

            <input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} className="choose-csv-file-btn"/>
            <label htmlFor="csv-file" className="choose-csv-file-label">Upload CSV File</label>
            {loading && <p>Analyzing data...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {chartData.length > 0 && (
                <>
                    <h4 style={{ marginTop: "30px" }}>Cramér’s V - Personality Association</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="variable" angle={-45} textAnchor="end" interval={0} />
                            <YAxis domain={[0, 1]} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                                <LabelList dataKey="value" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}

            {anova && (
                <div style={{ marginTop: "30px" }}>
                    <h4>ANOVA: Age vs Personality Type</h4>
                    <p><strong>F-value:</strong> {anova.F.toFixed(3)}</p>
                    <p><strong>p-value:</strong> {anova.p.toExponential(3)}</p>
                    <p>{anova.p < 0.05
                        ? "→ Statistically significant (p < 0.05)"
                        : "→ Not statistically significant"}
                    </p>
                </div>
            )}

            {genderDist.length > 0 && (
                <>
                    <h4 style={{ marginTop: "30px" }}>Gender Distribution by Personality Type</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={genderDist}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="personality" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="male" stackId="a" fill="#8884d8" />
                            <Bar dataKey="female" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="unspecified" stackId="a" fill="#ccc" />
                        </BarChart>
                    </ResponsiveContainer>

                    {genderStats && (
                        <div style={{ marginTop: "15px" }}>
                            <p><strong>Chi²:</strong> {genderStats.chi2.toFixed(3)}</p>
                            <p><strong>p-value:</strong> {genderStats.p.toFixed(3)}</p>
                            <p>
                                {genderStats.p < 0.05
                                    ? "→ Statistically significant association"
                                    : "→ No statistically significant association"}
                            </p>
                        </div>
                    )}

                    {ageBox.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>User Age Distribution by Personality Type</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ageBox}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="personality" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="min" fill="#ddd" name="Min" />
                                    <Bar dataKey="q1" fill="#a8dadc" name="Q1 (25%)" />
                                    <Bar dataKey="median" fill="#457b9d" name="Median" />
                                    <Bar dataKey="q3" fill="#1d3557" name="Q3 (75%)" />
                                    <Bar dataKey="max" fill="#000" name="Max" />
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    )}

                    {anova && (
                        <div style={{ marginTop: "15px" }}>
                            <p><strong>ANOVA F:</strong> {anova.F.toFixed(3)}</p>
                            <p><strong>p-value:</strong> {anova.p < 0.001 ? anova.p.toExponential(2) : anova.p.toFixed(3)}</p>
                            <p>{anova.p < 0.05 ? "→ Statistically significant differences in age" : "→ No significant age difference across personality types"}</p>
                        </div>
                    )}


                    {bodyDist.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>Body Type Distribution by Personality Type</h4>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={bodyDist}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="personality" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {[...Array(10).keys()].map(i => (
                                        <Bar key={i} dataKey={`type_${i + 1}`} fill={`hsl(${i * 36}, 60%, 60%)`} name={`Type ${i + 1}`} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>

                            {bodyCramersV !== null && (
                                <div style={{ marginTop: "15px" }}>
                                    <p><strong>Cramér’s V:</strong> {bodyCramersV.toFixed(3)}</p>
                                    <p>{bodyCramersV > 0.25
                                        ? "→ Moderate to strong association"
                                        : bodyCramersV > 0.1
                                            ? "→ Weak to moderate association"
                                            : "→ Weak or negligible association"}
                                    </p>
                                </div>
                            )}

                            {hairDist.length > 0 && (
                                <>
                                    <h4 style={{ marginTop: "30px" }}>Hair Length Distribution by Personality Type</h4>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={hairDist}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="personality" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            {[...Array(6).keys()].map(i => (
                                                <Bar
                                                    key={i}
                                                    dataKey={`length_${i + 1}`}
                                                    stackId="a"
                                                    fill={`hsl(${i * 60}, 60%, 65%)`}
                                                    name={`Length ${i + 1}`}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>

                                    {hairStats && (
                                        <div style={{ marginTop: "15px" }}>
                                            <p><strong>Cramér’s V:</strong> {hairStats.cramersV.toFixed(3)}</p>
                                            <p><strong>Chi²:</strong> {hairStats.chi2.toFixed(3)}</p>
                                            <p><strong>p-value:</strong> {hairStats.p < 0.001 ? hairStats.p.toExponential(2) : hairStats.p.toFixed(3)}</p>
                                            <p>
                                                {hairStats.p < 0.05
                                                    ? "→ Statistically significant association"
                                                    : "→ No statistically significant association"}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                        </>
                    )}

                    {hairGenderDist.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>Hair Length Distribution by Gender</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={hairGenderDist}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="gender" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {[...Array(6).keys()].map(i => (
                                        <Bar
                                            key={i}
                                            dataKey={`length_${i + 1}`}
                                            stackId="a"
                                            fill={`hsl(${i * 60}, 70%, 65%)`}
                                            name={`Length ${i + 1}`}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>

                            {hairGenderStats && (
                                <div style={{ marginTop: "15px" }}>
                                    <p><strong>Cramér’s V:</strong> {hairGenderStats.cramersV.toFixed(3)}</p>
                                    <p><strong>Chi²:</strong> {hairGenderStats.chi2.toFixed(3)}</p>
                                    <p><strong>p-value:</strong> {hairGenderStats.p < 0.001 ? hairGenderStats.p.toExponential(2) : hairGenderStats.p.toFixed(3)}</p>
                                    <p>
                                        {hairGenderStats.p < 0.05
                                            ? "→ Statistically significant association between hair length and gender"
                                            : "→ No statistically significant association"}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {hairComboDist.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>Hair Length by Personality Type & Gender</h4>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={hairComboDist}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="label"
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}  // give space for rotation
                                    />

                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {[...Array(6).keys()].map(i => (
                                        <Bar
                                            key={i}
                                            dataKey={`length_${i + 1}`}
                                            stackId="a"
                                            fill={`hsl(${i * 60}, 60%, 65%)`}
                                            name={`Length ${i + 1}`}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    )}

                    {unusualHair.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>Unusual Hairstyle by Personality Type</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={unusualHair}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="personality" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="true" fill="#e76f51" name="True" />
                                    <Bar dataKey="false" fill="#264653" name="False" />
                                </BarChart>
                            </ResponsiveContainer>
                            <p style={{ marginTop: "10px" }}><strong>Cramér’s V:</strong> {uhCramersV?.toFixed(3)}</p>
                        </>
                    )}

                    {unusualAppearance.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>Unusual Appearance by Personality Type</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={unusualAppearance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="personality" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="true" fill="#f4a261" name="True" />
                                    <Bar dataKey="false" fill="#2a9d8f" name="False" />
                                </BarChart>
                            </ResponsiveContainer>
                            <p style={{ marginTop: "10px" }}><strong>Cramér’s V:</strong> {uaCramersV?.toFixed(3)}</p>
                        </>
                    )}


                    {appearanceDist.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>Appearance by Personality Type</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={appearanceDist}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="personality" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="neat" stackId="a" fill="#2a9d8f" name="Neat" />
                                    <Bar dataKey="slightly_messy" stackId="a" fill="#e9c46a" name="Slightly Messy" />
                                    <Bar dataKey="messy" stackId="a" fill="#f4a261" name="Messy" />
                                    <Bar dataKey="neutral" stackId="a" fill="#264653" name="Neutral" />
                                </BarChart>
                            </ResponsiveContainer>

                            <p style={{ marginTop: "10px" }}>
                                <strong>Cramér’s V:</strong> {appearanceV?.toFixed(3)}<br />
                                {appearanceV > 0.25
                                    ? "→ Moderate to strong association"
                                    : appearanceV > 0.1
                                        ? "→ Weak to moderate association"
                                        : "→ Weak or negligible association"}
                            </p>
                        </>
                    )}

                    {pcaPoints.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "30px" }}>PCA Projection (2D Personality Clustering)</h4>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="x" name="PC1" />
                                    <YAxis type="number" dataKey="y" name="PC2" />
                                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                    <Legend />
                                    {Array.from(new Set(pcaPoints.map(p => p.type))).map((t, i) => (
                                        <Scatter
                                            key={t}
                                            name={t}
                                            data={pcaPoints.filter(p => p.type === t)}
                                            fill={`hsl(${i * 20}, 70%, 55%)`}
                                        />
                                    ))}
                                </ScatterChart>
                            </ResponsiveContainer>
                        </>
                    )}




                </>
            )}

        </div>
    );
}
