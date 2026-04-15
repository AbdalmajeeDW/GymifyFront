"use client";

// import { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';

// interface FaceDetection {
//   detection: faceapi.FaceDetection;
//   landmarks: faceapi.FaceLandmarks68;
//   descriptor?: Float32Array;
//   score: string;
// }

// interface StoredFace {
//   descriptor: Float32Array;
//   name: string;
//   image: string;
// }

// export default function FaceRecognitionSystem(): JSX.Element {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
//   const [isDetecting, setIsDetecting] = useState<boolean>(false);
//   const [faces, setFaces] = useState<FaceDetection[]>([]);
//   const [storedFaces, setStoredFaces] = useState<StoredFace[]>([]);
//   const [matches, setMatches] = useState<{ faceIndex: number, storedFace: StoredFace, distance: number }[]>([]);
//   const [error, setError] = useState<string>('');
//   const [loadingProgress, setLoadingProgress] = useState<string>('');
//   const [selectedImage, setSelectedImage] = useState<string>('');
//   const [faceName, setFaceName] = useState<string>('');
//   const [showMatchPopup, setShowMatchPopup] = useState<boolean>(false);
//   const [currentMatch, setCurrentMatch] = useState<{ storedFace: StoredFace, distance: number } | null>(null);
//   const [cameraType, setCameraType] = useState<'webcam' | 'droidcam'>('droidcam');
//   const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
//   const [cameraStatus, setCameraStatus] = useState<string>('جاري التهيئة...');
//   const detectionInterval = useRef<NodeJS.Timeout | null>(null);
//   const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const currentMatchesRef = useRef<{ faceIndex: number, storedFace: StoredFace, distance: number }[]>([]);
//   const lastPlayedMatchRef = useRef<string>('');

//   // نغمة هادئة واحدة فقط
//   const gentleSound = "https://assets.mixkit.co/active_storage/sfx/259/259-preview.mp3";

//   // DroidCam IP
//   const DROIDCAM_IP = "192.168.2.115";
//   const DROIDCAM_URL = `http://${DROIDCAM_IP}1`;

//   const loadModelsIndividually = async (): Promise<void> => {
//     try {
//       setLoadingProgress('جاري تحميل النماذج...');

//       const models = [
//         { name: 'كاشف الوجوه', loader: () => faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/') },
//         { name: 'معالم الوجه', loader: () => faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/') },
//         { name: 'التعرف على الوجه', loader: () => faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/') }
//       ];

//       for (const model of models) {
//         setLoadingProgress(`جاري تحميل ${model.name}...`);
//         try {
//           await model.loader();
//           console.log(`✅ تم تحميل ${model.name}`);
//         } catch (modelError) {
//           console.error(`❌ فشل في تحميل ${model.name}:`, modelError);
//           throw new Error(`فشل في تحميل ${model.name}`);
//         }
//       }

//       setModelsLoaded(true);
//       setLoadingProgress('');
//       console.log('🎉 تم تحميل جميع النماذج بنجاح!');

//     } catch (error) {
//       console.error('❌ فشل في تحميل النماذج:', error);
//       setError('تعذر تحميل بعض النماذج. النظام قد لا يعمل بشكل كامل.');
//       setLoadingProgress('');
//     }
//   };

//   const playNotificationSound = (): void => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.volume = 0.3; // صوت هادئ
//       audioRef.current.play().catch(error => {
//         console.log('تعذر تشغيل النغمة:', error);
//       });
//     }
//   };

//   const calculateSimilarity = (distance: number): number => {
//     return Math.max(0, (1 - distance) * 100);
//   };

//   const showMatchNotification = (match: { storedFace: StoredFace, distance: number }): void => {
//     const similarity = calculateSimilarity(match.distance);

//     if (similarity < 60) return;

//     const matchKey = `${match.storedFace.name}-${Date.now()}`;

//     if (lastPlayedMatchRef.current === matchKey) return;

//     lastPlayedMatchRef.current = matchKey;
//     setCurrentMatch(match);
//     setShowMatchPopup(true);
//     playNotificationSound();

//     if (popupTimeoutRef.current) {
//       clearTimeout(popupTimeoutRef.current);
//     }
//     popupTimeoutRef.current = setTimeout(() => {
//       setShowMatchPopup(false);
//       setCurrentMatch(null);
//     }, 4000);
//   };

//   const stopCamera = (): void => {
//     if (videoRef.current) {
//       if (videoRef.current.srcObject) {
//         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
//         tracks.forEach(track => track.stop());
//         videoRef.current.srcObject = null;
//       }
//       if (videoRef.current.src) {
//         videoRef.current.src = '';
//       }
//     }
//     setIsCameraActive(false);
//     setCameraStatus('متوقف');
//   };

//   // دالة محسنة لبدء DroidCam مع فيديو مخفي
//   const startDroidCam = async (): Promise<void> => {
//     try {
//       stopCamera();
//       setCameraStatus('جاري الاتصال بـ DroidCam...');

//       console.log('🚀 محاولة الاتصال بـ DroidCam...');

//       if (videoRef.current) {
//         // إعداد الفيديو كعنصر مخفي
//         videoRef.current.style.display = 'none';
//         videoRef.current.crossOrigin = 'anonymous';
//         videoRef.current.playsInline = true;
//         videoRef.current.muted = true;

//         videoRef.current.onloadeddata = () => {
//           console.log('✅ DroidCam connected successfully (hidden)');
//           setIsCameraActive(true);
//           setCameraStatus('متصل - DroidCam');
//           setError('');
//         };

//         videoRef.current.onerror = () => {
//           console.error('❌ DroidCam connection failed');
//           setError(`فشل في الاتصال بكاميرا DroidCam على ${DROIDCAM_IP}`);
//           setCameraStatus('فشل الاتصال');
//           setIsCameraActive(false);
//         };

//         videoRef.current.onloadstart = () => {
//           setCameraStatus('جاري تحميل البث...');
//         };

//         // تعيين مصدر الفيديو مع timestamp
//         videoRef.current.src = `${DROIDCAM_URL}?t=${Date.now()}`;

//         try {
//           await videoRef.current.play();
//           console.log('🎬 بدأ تشغيل الفيديو المخفي بنجاح');
//         } catch (playError) {
//           console.warn('⚠️ Autoplay prevented for hidden video');
//           // لا داعي للقلق، الفيديو مخفي على أي حال
//         }
//       }

//     } catch (error) {
//       console.error('❌ خطأ في تشغيل DroidCam:', error);
//       setError(`فشل في تشغيل DroidCam: ${error}`);
//       setIsCameraActive(false);
//       setCameraStatus('فشل التشغيل');
//     }
//   };

//   const startWebcam = async (): Promise<void> => {
//     try {
//       stopCamera();
//       setCameraStatus('جاري الاتصال بكاميرا الويب...');

//       if (!navigator.mediaDevices?.getUserMedia) {
//         throw new Error('الكاميرا غير مدعومة في هذا المتصفح');
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: 640,
//           height: 480,
//           facingMode: "user"
//         }
//       });

//       if (videoRef.current) {
//         videoRef.current.style.display = 'none'; // إخفاء الفيديو
//         videoRef.current.srcObject = stream;
//         videoRef.current.onloadeddata = () => {
//           console.log('✅ تم استخدام كاميرا الويب الداخلية (مخفي)');
//           setIsCameraActive(true);
//           setCameraStatus('يعمل - كاميرا الويب');
//           setError('');
//         };
//       }
//     } catch (error) {
//       console.error('❌ فشل في تشغيل كاميرا الويب:', error);
//       setError('فشل في الوصول إلى كاميرا الويب الداخلية');
//       setIsCameraActive(false);
//       setCameraStatus('فشل الاتصال');
//     }
//   };

//   const startCamera = async (type: 'webcam' | 'droidcam' = cameraType): Promise<void> => {
//     setCameraType(type);
//     if (type === 'droidcam') {
//       await startDroidCam();
//     } else {
//       await startWebcam();
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);

//       const img = await faceapi.bufferToImage(file);
//       const detections = await faceapi
//         .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       if (detections.length === 0) {
//         setError('لم يتم العثور على أي وجه في الصورة المرفوعة');
//         return;
//       }

//       if (!faceName.trim()) {
//         setError('الرجاء إدخال اسم للوجه');
//         return;
//       }

//       const newStoredFace: StoredFace = {
//         descriptor: detections[0].descriptor,
//         name: faceName,
//         image: imageUrl
//       };

//       setStoredFaces(prev => [...prev, newStoredFace]);
//       setFaceName('');
//       setError('');

//       console.log(`✅ تم حفظ وجه: ${faceName}`);

//     } catch (error) {
//       console.error('❌ خطأ في معالجة الصورة:', error);
//       setError('فشل في معالجة الصورة المرفوعة');
//     }
//   };

//   const compareFaces = (faceDescriptor: Float32Array, storedFaces: StoredFace[]): { storedFace: StoredFace, distance: number } | null => {
//     let bestMatch: { storedFace: StoredFace, distance: number } | null = null;
//     const similarityThreshold = 50;

//     for (const storedFace of storedFaces) {
//       const distance = faceapi.euclideanDistance(faceDescriptor, storedFace.descriptor);
//       const similarity = calculateSimilarity(distance);

//       if (similarity >= similarityThreshold) {
//         if (!bestMatch || distance < bestMatch.distance) {
//           bestMatch = { storedFace, distance };
//         }
//       }
//     }

//     return bestMatch;
//   };

//   const detectAndCompareFaces = async (): Promise<void> => {
//     if (!videoRef.current || !canvasRef.current || !modelsLoaded || !isCameraActive) {
//       return;
//     }

//     try {
//       const video = videoRef.current;

//       // التحقق من أن الفيديو جاهز
//       if (video.readyState !== 4) {
//         return;
//       }

//       const displaySize = { width: video.videoWidth, height: video.videoHeight };

//       // إذا كان حجم الفيديو صفر، توقف
//       if (displaySize.width === 0 || displaySize.height === 0) {
//         return;
//       }

//       const detections = await faceapi
//         .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       const faceData: FaceDetection[] = detections.map(detection => ({
//         detection: detection.detection,
//         landmarks: detection.landmarks,
//         descriptor: detection.descriptor,
//         score: detection.detection.score.toFixed(2)
//       }));

//       setFaces(faceData);

//       const newMatches: { faceIndex: number, storedFace: StoredFace, distance: number }[] = [];
//       faceData.forEach((face, index) => {
//         if (face.descriptor && storedFaces.length > 0) {
//           const match = compareFaces(face.descriptor, storedFaces);
//           if (match) {
//             const similarity = calculateSimilarity(match.distance);
//             if (similarity >= 60) {
//               newMatches.push({
//                 faceIndex: index,
//                 storedFace: match.storedFace,
//                 distance: match.distance
//               });
//             }
//           }
//         }
//       });

//       newMatches.forEach(match => {
//         const similarity = calculateSimilarity(match.distance);
//         if (similarity >= 60) {
//           const isNewMatch = !currentMatchesRef.current.some(
//             existingMatch => existingMatch.storedFace.name === match.storedFace.name
//           );

//           if (isNewMatch) {
//             showMatchNotification(match);
//           }
//         }
//       });

//       currentMatchesRef.current = newMatches;
//       setMatches(newMatches);

//     } catch (error) {
//       console.error('❌ خطأ في كشف الوجوه:', error);
//     }
//   };

//   const toggleDetection = async (): Promise<void> => {
//     if (isDetecting) {
//       setIsDetecting(false);
//       if (detectionInterval.current) {
//         clearInterval(detectionInterval.current);
//         detectionInterval.current = null;
//       }
//     } else {
//       if (!modelsLoaded) {
//         setError('الرجاء الانتظار حتى يتم تحميل النماذج');
//         return;
//       }

//       if (!isCameraActive) {
//         await startCamera();
//       }

//       setIsDetecting(true);
//       detectionInterval.current = setInterval(detectAndCompareFaces, 1000);
//     }
//   };

//   const removeStoredFace = (index: number): void => {
//     setStoredFaces(prev => prev.filter((_, i) => i !== index));
//   };

//   const closePopup = (): void => {
//     setShowMatchPopup(false);
//     setCurrentMatch(null);
//     if (popupTimeoutRef.current) {
//       clearTimeout(popupTimeoutRef.current);
//     }
//   };

//   const switchCamera = async (): Promise<void> => {
//     const newType = cameraType === 'droidcam' ? 'webcam' : 'droidcam';
//     await startCamera(newType);
//   };

//   // بدء الكاميرا تلقائياً عند تحميل النماذج
//   useEffect(() => {
//     if (modelsLoaded) {
//       console.log('🚀 بدء الكاميرا تلقائياً...');
//       const autoStart = async () => {
//         await startCamera('droidcam');
//         // انتظر ثانيتين ثم ابدأ الكشف
//         setTimeout(() => {
//           setIsDetecting(true);
//           detectionInterval.current = setInterval(detectAndCompareFaces, 1000);
//         }, 2000);
//       };
//       autoStart();
//     }
//   }, [modelsLoaded]);

//   useEffect(() => {
//     if (isDetecting && storedFaces.length > 0) {
//       console.log('🔄 إعادة تشغيل الكشف بسبب إضافة وجوه جديدة');
//       if (detectionInterval.current) {
//         clearInterval(detectionInterval.current);
//       }
//       detectionInterval.current = setInterval(detectAndCompareFaces, 1000);
//     }
//   }, [storedFaces.length]);

//   useEffect(() => {
//     loadModelsIndividually();

//     return () => {
//       if (detectionInterval.current) {
//         clearInterval(detectionInterval.current);
//       }
//       if (popupTimeoutRef.current) {
//         clearTimeout(popupTimeoutRef.current);
//       }
//       stopCamera();
//     };
//   }, []);

//   return (
//     <div className="max-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       <audio ref={audioRef} preload="auto" src={gentleSound}>
//         <source src={gentleSound} type="audio/mpeg" />
//       </audio>

//       {/* عنصر الفيديو المخفي */}
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         style={{ display: 'none' }}
//         crossOrigin="anonymous"
//       />

//       {showMatchPopup && currentMatch && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-emerald-100">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>

//               <h3 className="text-xl font-semibold text-gray-900 mb-2">تم التعرف على الوجه</h3>
//               <p className="text-gray-600 mb-4">تم العثور على تطابق في قاعدة البيانات</p>

//               <div className="relative mx-auto w-24 h-24 mb-4">
//                 <img
//                   src={currentMatch.storedFace.image}
//                   alt={currentMatch.storedFace.name}
//                   className="w-full h-full rounded-lg object-cover border-2 border-emerald-200 shadow-sm"
//                 />
//               </div>

//               <div className="bg-emerald-50 rounded-lg p-3 mb-4 border border-emerald-200">
//                 <h4 className="font-semibold text-emerald-800 mb-1">{currentMatch.storedFace.name}</h4>
//                 <div className="flex items-center justify-center space-x-2">
//                   <span className="text-emerald-700 font-medium">
//                     نسبة المطابقة: {calculateSimilarity(currentMatch.distance).toFixed(0)}%
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={closePopup}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
//               >
//                 تم
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام التعرف على الوجوه</h1>
//           <p className="text-gray-600">نظام ذكي للتعرف على الوجوه باستخدام الذكاء الاصطناعي</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {loadingProgress && (
//           <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//               {loadingProgress}
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* القسم الأيسر - التحكم */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               {/* عرض حالة الكاميرا بدلاً من الفيديو */}
//               <div className="bg-gray-900 rounded-t-2xl h-64 lg:h-80 flex items-center justify-center">
//                 <div className="text-center text-white">
//                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isCameraActive ? 'bg-emerald-500' : 'bg-gray-500'}`}>
//                     {isCameraActive ? (
//                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                       </svg>
//                     ) : (
//                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                     )}
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">
//                     {isCameraActive ? 'الكاميرا نشطة' : 'الكاميرا غير نشطة'}
//                   </h3>
//                   <p className="text-gray-300">{cameraStatus}</p>
//                   <p className="text-sm text-gray-400 mt-2">
//                     {cameraType === 'droidcam' ? `DroidCam - ${DROIDCAM_IP}` : 'كاميرا الويب الداخلية'}
//                   </p>
//                 </div>
//               </div>

//               <div className="p-4 space-y-4">
//                 <div className="flex gap-3">
//                   <button
//                     onClick={toggleDetection}
//                     disabled={!modelsLoaded || !isCameraActive}
//                     className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
//                       modelsLoaded && isCameraActive
//                         ? isDetecting
//                           ? 'bg-red-500 hover:bg-red-600 text-white'
//                           : 'bg-emerald-500 hover:bg-emerald-600 text-white'
//                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     }`}
//                   >
//                     {!modelsLoaded && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>}
//                     {isDetecting ? 'إيقاف المسح' : modelsLoaded ? 'بدء المسح' : 'جاري التحميل...'}
//                   </button>

//                   <button
//                     onClick={switchCamera}
//                     className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
//                   >
//                     {cameraType === 'droidcam' ? 'كاميرا الهاتف' : 'كاميرا الويب'}
//                   </button>
//                 </div>

//                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                   <p className="text-sm text-gray-600 text-center">
//                     النظام يعمل في الخلفية - الكاميرا مخفية
//                   </p>
//                   <p className="text-sm text-gray-500 text-center mt-1">
//                     الوجوه المكتشفة: {faces.length} | المطابقات: {matches.filter(match => calculateSimilarity(match.distance) >= 60).length}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* القسم الأيمن - القوائم */}
//           <div className="space-y-6">
//             {/* إضافة ملف تعريف جديد */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <h3 className="font-semibold text-lg text-gray-900 mb-4">إضافة ملف تعريف جديد</h3>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="اسم المستخدم"
//                   value={faceName}
//                   onChange={(e) => setFaceName(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//                 />
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
//                 >
//                   رفع صورة
//                 </button>
//               </div>
//             </div>

//             {/* قاعدة البيانات */}
//             {storedFaces.length > 0 && (
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//                 <h3 className="font-semibold text-lg text-gray-900 mb-4">
//                   قاعدة البيانات ({storedFaces.length})
//                 </h3>
//                 <div className="space-y-3 max-h-60 overflow-y-auto">
//                   {storedFaces.map((storedFace, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={storedFace.image}
//                           alt={storedFace.name}
//                           className="w-10 h-10 rounded-lg object-cover border border-gray-300"
//                         />
//                         <span className="font-medium text-gray-900">{storedFace.name}</span>
//                       </div>
//                       <button
//                         onClick={() => removeStoredFace(index)}
//                         className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* المطابقات الناجحة */}
//             {matches.length > 0 && (
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200">
//                 <h3 className="font-semibold text-lg text-emerald-800 mb-4">تم الوصول بنجاح</h3>
//                 <div className="space-y-3">
//                   {matches.map((match, index) => {
//                     const similarity = calculateSimilarity(match.distance);
//                     if (similarity >= 60) {
//                       return (
//                         <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
//                           <div className="flex items-center space-x-3">
//                             <img
//                               src={match.storedFace.image}
//                               alt={match.storedFace.name}
//                               className="w-10 h-10 rounded-lg object-cover border border-emerald-300"
//                             />
//                             <div>
//                               <span className="font-medium text-emerald-800">{match.storedFace.name}</span>
//                               <span className="text-sm text-emerald-700 block">
//                                 نسبة المطابقة: {similarity.toFixed(0)}%
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     }
//                     return null;
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* حالة النظام */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <h3 className="font-semibold text-lg text-gray-900 mb-4">حالة النظام</h3>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="flex items-center space-x-2">
//                   <div className={`w-2 h-2 rounded-full ${modelsLoaded ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
//                   <span className="text-gray-600">النماذج:</span>
//                   <span className="font-medium">{modelsLoaded ? 'محمولة' : 'جاري التحميل'}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
//                   <span className="text-gray-600">الكاميرا:</span>
//                   <span className="font-medium">{isCameraActive ? 'نشطة' : 'غير نشطة'}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
//                   <span className="text-gray-600">المسح:</span>
//                   <span className="font-medium">{isDetecting ? 'نشط' : 'متوقف'}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//                   <span className="text-gray-600">الوجوه:</span>
//                   <span className="font-medium">{faces.length}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-purple-500"></div>
//                   <span className="text-gray-600">الملفات:</span>
//                   <span className="font-medium">{storedFaces.length}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//                   <span className="text-gray-600">المطابقات:</span>
//                   <span className="font-medium">{matches.filter(match => calculateSimilarity(match.distance) >= 60).length}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GymBarChart from "../components/Chartbar";
import Chartline from "../components/Chartline";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart3,
  LineChart,
  Target,
  Zap,
  Award,
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalPlayers: 340,
    avgAttendance: 58,
    monthlyRevenue: 15600,
    retentionRate: 87,
    activeTrainers: 12,
    totalClasses: 45,
    newThisMonth: 28,
    premiumMembers: 89,
  });

  const monthlySubscriptionsData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    datasets: [
      {
        label: "New subscriptions",
        data: [15, 22, 18, 25, 20, 28],
        backgroundColor: "#8b5cf6", // purple-500
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: "Subscription renewals",
        data: [120, 115, 125, 130, 128, 135],
        backgroundColor: "#3b82f6", // blue-500
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const playerData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو"],
    datasets: [
      {
        label: "Number of new players",
        data: [12, 19, 15, 25, 22],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
      {
        label: "Total players",
        data: [120, 145, 160, 185, 210],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const statCards = [
    {
      title: "Total players",
      value: stats.totalPlayers,
      change: "+12%",
      icon: Users,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Total registered members",
    },
    {
      title: "The average daily attendance",
      value: stats.avgAttendance,
      change: "+8%",
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Average daily attendance",
    },
    {
      title: "Monthly revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: "+15%",
      icon: DollarSign,
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      description: "Revenue this month",
    },
    {
      title: "Retention rate",
      value: `${stats.retentionRate}%`,
      change: "+5%",
      icon: TrendingUp,
      gradient: "from-red-500 to-pink-500",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      description: "Member retention rate",
    },
  ];

  const additionalStats = [
    {
      label: "Active trainers",
      value: stats.activeTrainers,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Weekly classes",
      value: stats.totalClasses,
      icon: Target,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Renewals this month",
      value: stats.newThisMonth,
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Premium members",
      value: stats.premiumMembers,
      icon: Award,
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className=" mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-right"
        ></motion.div>

        {/* Main Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary-purple-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${card.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <card.icon className={`w-6 h-6 ${card.textColor}`} />
                    </div>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {card.change}
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-400">{card.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {additionalStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 group"
            >
              <div
                className={`inline-flex p-2 rounded-lg bg-linear-to-r ${stat.color} text-white mb-3 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-linear-to-r from-blue-500 to-primary-purple-500  px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">
                    Growth trends{" "}
                  </h2>
                </div>
                <span className="text-white/80 text-sm">Last 5 months</span>
              </div>
            </div>
            <div className="p-6">
              <Chartline data={playerData} />
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-linear-to-r from-primary-purple-500 to-blue-500 to-secondry-blue px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">
                    Subscriptions analysis
                  </h2>
                </div>
                <span className="text-white/80 text-sm">Last 6 months</span>
              </div>
            </div>
            <div className="p-6">
              <GymBarChart
                data={monthlySubscriptionsData}
                title=""
                type="vertical"
              />
            </div>
          </motion.div>
        </div>

        {/* Quick Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-purple-500" />
            رؤى سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Member growth</p>
              <p className="text-2xl font-bold text-green-600">+18%</p>
              <p className="text-xs text-gray-400 mt-1">
                Compared to last month
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">
                Best time for attendance
              </p>
              <p className="text-xl font-bold text-primary-purple-500">
                6:00 PM - 8:00 PM
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Peak daily attendance
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">
                Most common age group / Largest age group
              </p>
              <p className="text-xl font-bold text-blue-600">25-35 years</p>
              <p className="text-xs text-gray-400 mt-1">45% of members</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
