import { createIcon } from '@chakra-ui/icons'
import { PulseLoader } from "react-spinners";
// export const LoaderIcon = createIcon({
//   displayName: 'LoaderIcon',
//   viewBox: '-115 0 89 98',
//   path: (
//     <>
//       <path
//         fill="currentColor"
//         opacity=".3"
//         d="m-97.8 13.3-9.8 5.7c-4.1 2.3-7.4 8.1-7.4 12.8v34.4c0 4.7 3.3 10.3 7.4 12.8l9.8 5.7V13.3z"
//       >
//         <animate
//           attributeType="CSS"
//           attributeName="opacity"
//           from=".3"
//           to=".3"
//           dur="0.8s"
//           values="0.30; 0.30; 1; 0.30;"
//           keyTimes="0; 0.3; 0.7; 1"
//           repeatCount="indefinite"
//           begin="0.6s"
//         />
//       </path>
//       <path
//         fill="currentColor"
//         opacity=".3"
//         d="m-33.4 18.9-9.8-5.7v71.2l9.8-5.7c4.1-2.3 7.4-8.1 7.4-12.8V31.7c0-4.7-3.3-10.4-7.4-12.8z"
//       >
//         <animate
//           attributeType="CSS"
//           attributeName="opacity"
//           from=".3"
//           to=".3"
//           dur="0.8s"
//           values="0.30; 0.30; 1; 0.30;"
//           keyTimes="0; 0.3; 0.7; 1"
//           repeatCount="indefinite"
//           begin="0.2s"
//         />
//       </path>
//       <path
//         fill="currentColor"
//         opacity=".3"
//         d="m-79.2 95.3 1.3.7c4.1 2.3 10.7 2.3 14.7 0l1.3-.7v-37s-2.5-4.3-8.7-4.3-8.7 4.3-8.7 4.3v37z"
//       >
//         <animate
//           attributeType="CSS"
//           attributeName="opacity"
//           from=".3"
//           to=".3"
//           dur="0.8s"
//           values="0.30; 0.30; 1; 0.30;"
//           keyTimes="0; 0.3; 0.7; 1"
//           repeatCount="indefinite"
//           begin="0.4s"
//         />
//       </path>
//       <path
//         fill="currentColor"
//         opacity=".3"
//         d="M-63.1 1.8c-4.1-2.3-10.7-2.3-14.7 0l-1.3.7v36.4s2.5 4.3 8.7 4.3 8.7-4.3 8.7-4.3V2.5l-1.4-.7z"
//       >
//         <animate
//           attributeType="CSS"
//           attributeName="opacity"
//           from=".3"
//           to=".3"
//           dur="0.8s"
//           values="0.30; 0.30; 1; 0.30;"
//           keyTimes="0; 0.3; 0.7; 1"
//           repeatCount="indefinite"
//           begin="0s"
//         />
//       </path>
//     </>
//   ),
// })


export const LoaderIcon = () => <PulseLoader color="#9A89F0"/>