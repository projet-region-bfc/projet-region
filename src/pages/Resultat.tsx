import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

interface ResultatChartProps {
    data: any[];
    nomEquipe: string;
}

export const ResultatChart = ({ data, nomEquipe }: ResultatChartProps) => {

    if (!data || data.length === 0) {
        return <p>Aucune donnée suffisante pour générer le graphique de l'équipe {nomEquipe}.</p>;
    }

    return (
        <div style={{ width: "100%", backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
                Maturité de l'équipe : {nomEquipe}
            </h3>

            <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {/* On passe directement tes données à Recharts */}
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid />

                        {/* 1. Les étiquettes autour (indicateur) */}
                        <PolarAngleAxis dataKey="indicateur" tick={{ fill: '#333', fontSize: 12 }} />

                        {/* L'échelle de 0 à 4 */}
                        <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fill: '#888' }} />

                        {/* 2. La toile mauve pour l'Équipe (scoreEquipe) */}
                        <Radar
                            name="Moyenne de l'équipe"
                            dataKey="scoreEquipe"
                            stroke="#gray"
                            fill="#gray"
                            fillOpacity={0.6}
                        />

                        <Radar
                            name="Mon score"
                            dataKey="scoreIndividuel"
                            stroke="#117D88"
                            fill="#117D88"
                            fillOpacity={0.5}
                        />

                        <Tooltip />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};