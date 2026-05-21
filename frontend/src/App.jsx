import { useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {

  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeReview = async () => {

    if (!review.trim()) return;

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          review: review
        }
      );

      setResult(response.data);

      // Save history
      setHistory(prev => [
        {
          text: review,
          prediction: response.data.prediction,
          confidence: response.data.confidence
        },
        ...prev
      ]);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  // Chart Data
  const chartData = result ? [
    {
      name: "Confidence",
      value: result.confidence
    },
    {
      name: "Remaining",
      value: 100 - result.confidence
    }
  ] : [];

  const COLORS = ["#2563eb", "#374151"];

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 text-white p-10">

      <h1 className="text-6xl font-bold text-center mb-12">
        SmartReview AI
      </h1>

      <div className="max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-gray-800">

        <textarea
          className="w-full h-44 p-5 rounded-2xl text-black text-lg"
          placeholder="Enter review text..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={analyzeReview}
          className="mt-6 bg-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-700 transition text-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze Review"}
        </button>

        {result && (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">

            {/* LEFT SIDE */}
            <div className="space-y-6">

              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-3">
                  Prediction
                </h2>

                <p className={`text-3xl font-bold ${
                  result.prediction === "Fake Review"
                    ? "text-red-400"
                    : "text-green-400"
                }`}>
                  {result.prediction}
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-3">
                  Confidence Score
                </h2>

                <p className="text-3xl font-bold text-blue-400">
                  {result.confidence}%
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-3">
                  Sentiment
                </h2>

                <p className="text-3xl font-bold text-yellow-400">
                  {result.sentiment}
                </p>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">

              <h2 className="text-2xl font-semibold mb-6 text-center">
                Prediction Confidence
              </h2>

              <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* HISTORY */}

        {history.length > 0 && (

          <div className="mt-12">

            <h2 className="text-3xl font-bold mb-6">
              Recent Reviews
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full bg-gray-800 rounded-2xl overflow-hidden">

                <thead className="bg-gray-700">

                  <tr>
                    <th className="p-4 text-left">Review</th>
                    <th className="p-4 text-left">Prediction</th>
                    <th className="p-4 text-left">Confidence</th>
                  </tr>

                </thead>

                <tbody>

                  {history.map((item, index) => (

                    <tr
                      key={index}
                      className="border-t border-gray-700"
                    >

                      <td className="p-4">
                        {item.text}
                      </td>

                      <td className="p-4">

                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.prediction === "Fake Review"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}>

                          {item.prediction}

                        </span>

                      </td>

                      <td className="p-4">
                        {item.confidence}%
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default App;