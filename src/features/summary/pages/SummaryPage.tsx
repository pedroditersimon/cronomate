import BarChart from "src/features/summary/components/BarChart";
import PageLayout from "src/shared/layouts/PageLayout";

export default function SummaryPage() {
    return (
        <PageLayout>
            <h1>Summary Page</h1>
            <p>This is the summary page.</p>
            <BarChart></BarChart>
        </PageLayout>
    );
}