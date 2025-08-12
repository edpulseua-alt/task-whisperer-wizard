import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Post a Task | Fast, local help for any job</title>
        <meta name="description" content="Describe your task, pick a location, add details and set your budget to get offers from nearby Taskers." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/"} />
      </Helmet>
      <section className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Welcome to Your Task Posting Flow</h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Post a task: Tell us what you need done and get offers from skilled Taskers in your area.
          </p>
          <Link to="/post-task">
            <Button variant="hero" size="lg">Post a task</Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Index;
