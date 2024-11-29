export default function Header() {
    return (
        <header className="ml-64 flex justify-between items-center px-6 py-4 bg-background shadow-lg border-b border-muted relative z-10">

        <h1 className="text-lg font-bold">OCIA Dashboard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search on-chain data"
            className="px-4 py-2 rounded-lg bg-[#2A2A2A] text-secondary placeholder-textSecondary focus:outline-none"
          />
          <button className="bg-primary px-4 py-2 rounded-lg text-secondary hover:bg-primaryHover transition">
            Connect Wallet
          </button>
        </div>
      </header>
    );
  }
  

  