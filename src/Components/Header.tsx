interface HeaderProps {
  buttonText: string;
  onButtonClick: () => void; 
}

export default function Header({ buttonText, onButtonClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-10 py-3 bg-[#18181b]">
      <img src="./Frame-39624.svg" alt="Logo" />
      <button
        className="px-4 py-2 text-sm font-semibold text-gray-800 bg-[#a3e635] rounded hover:bg-green-500"
        onClick={onButtonClick} 
      >
        {buttonText}
      </button>
    </header>
  );
}
