
export default function Loading() {
    
    return(
      <div className='flex text-black dark:text-gray-300 bg-white dark:bg-[#292a2d] min-h-screen items-center justify-center' role='status'>
   <svg className="w-6 h-6 dark:text-white text-gray-700" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="60" strokeDashoffset="60">
    <animate attributeName="stroke-dashoffset" values="60;0;60" dur="2s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>
    </div>
    )
  }