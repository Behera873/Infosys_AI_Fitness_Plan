export default function ScheduleGrid({ schedule }) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="schedule">
      <table>
        <thead>
          <tr>
            <th>Week</th>
            {days.map(d => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {Object.entries(schedule).map(([week, plan]) => (
            <tr key={week}>
              <td>{week}</td>
              {plan.map((item,i)=><td key={i}>{item}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
