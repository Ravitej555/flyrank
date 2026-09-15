import SettingsForm from '@/components/SettingsForm';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-400">FlyRank Preferences</h1>
        <p className="text-slate-400 mt-2">Adjust multi-dimensional flight utility criteria</p>
      </header>
      <SettingsForm />
    </main>
  );
}
