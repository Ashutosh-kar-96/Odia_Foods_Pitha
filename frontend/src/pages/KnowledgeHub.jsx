import { BookOpen, Flame, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

const fallbackPosts = [
  {
    id: 1,
    title: "Why Pithas Matter in Odia Festivals",
    excerpt: "Pithas carry stories of harvest, family rituals, and temple culture.",
    content: "Raja, Prathamastami, Manabasa Gurubar, Rath Yatra, and Pana Sankranti each bring their own food memories.",
    category: "Culture"
  }
];

export default function KnowledgeHub() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/knowledge").then(({ data }) => setPosts(data)).catch(() => setPosts(fallbackPosts));
  }, []);

  return (
    <section className="container-page py-12">
      <div className="max-w-3xl">
        <p className="font-semibold uppercase tracking-[0.2em] text-clay">Knowledge Hub</p>
        <h1 className="section-title mt-2">Odisha Food Stories, Recipes and Heritage</h1>
        <p className="mt-4 text-lg leading-8 text-ink/70">
          Learn the history, ritual meaning, traditional cooking methods, storage guidance, and food stories behind Odisha's Pithas and Panas.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          [BookOpen, "History", "Food memories from temples, harvest cycles, and Odia households."],
          [Utensils, "Cooking Methods", "Steaming in turmeric leaves, slow baking, tawa cooking, and jaggery work."],
          [Flame, "Festival Significance", "Raja, Rath Yatra, Makar Sankranti, Manabasa Gurubar, and more."]
        ].map(([Icon, title, text]) => (
          <div key={title} className="rounded-lg border border-temple/10 bg-white p-6 shadow-sm">
            <Icon className="text-sindoor" />
            <h2 className="mt-4 font-display text-2xl font-bold text-temple">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-temple/10 bg-white p-6 shadow-sm">
            <span className="rounded-full bg-haldi/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-temple">{post.category}</span>
            <h2 className="mt-4 font-display text-2xl font-bold text-temple">{post.title}</h2>
            <p className="mt-3 font-medium text-clay">{post.excerpt}</p>
            <p className="mt-4 leading-7 text-ink/70">{post.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
