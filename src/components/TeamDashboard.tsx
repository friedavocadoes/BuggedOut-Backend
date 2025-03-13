import { useState, useEffect } from "react";

export default function TeamDashboard() {
  const [form1Active, setForm1Active] = useState(false);
  const [form2Active, setForm2Active] = useState(false);

  useEffect(() => {
    // Fetch form status
    fetchFormStatus();
  }, []);

  const fetchFormStatus = async () => {
    const response = await fetch("/api/forms");
    const data = await response.json();
    setForm1Active(data.find((form) => form.name === "Form 1").active);
    setForm2Active(data.find((form) => form.name === "Form 2").active);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Team Dashboard</h1>
      {form1Active && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Bug Report (Round 1)</h2>
          {/* Bug report form */}
        </section>
      )}
      {form2Active && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Bug Fix (Round 2)</h2>
          {/* Bug fix form */}
        </section>
      )}
      <section>
        <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
        {/* Display leaderboard */}
      </section>
    </div>
  );
}
