"use client";

import { useParams } from "next/navigation";
import { useSchedulerByID } from "@/hooks/scheduler/useSchedulerByID";

const SchedulerPage = () => {
  // Extract the scheduler ID from the URL
  const { schedulersID } = useParams();
  const { data, isLoading, isError } = useSchedulerByID(Number(schedulersID));

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading scheduler data</div>;

  // Destructure scheduler attributes from the data
  const { attributes: scheduler } = data;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Scheduler Details</h1>
      <section style={{ marginBottom: "2rem" }}>
        <h2>{scheduler.Name}</h2>
        <p>
          <strong>Scheduled Time:</strong> {scheduler.Time}
        </p>
        <p>
          <strong>Rendering Status:</strong>{" "}
          {scheduler.isRendering ? "Rendering" : "Not Rendering"}
        </p>
        <p>
          <strong>Queued:</strong> {scheduler.Queued ? "Yes" : "No"}
        </p>
        {scheduler.days_of_the_week?.data && (
          <p>
            <strong>Day of the Week:</strong>{" "}
            {scheduler.days_of_the_week.data.attributes.Name}
          </p>
        )}
      </section>
    </div>
  );
};

export default SchedulerPage;
