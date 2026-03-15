export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 316 150"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20,50 C35,20 65,20 80,50 C95,80 65,80 50,65" 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="10" 
                  strokeLinecap="round" />
            <circle cx="15" cy="58" r="14" fill="#10B981" />
            <circle cx="85" cy="58" r="14" fill="#10B981" />
            
            {/* Massive Text */}
            <text x="110" y="45" fontFamily="sans-serif" fontSize="50" fontWeight="900" fill="#1F2937">
                STAY
            </text>
            <text x="110" y="90" fontFamily="sans-serif" fontSize="50" fontWeight="900" fill="#3B82F6">
                FIT
            </text>
            
            <rect x="110" y="96" width="130" height="8" fill="#10B981" rx="4" />
        </svg>
    );
}
