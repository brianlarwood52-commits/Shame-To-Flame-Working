(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/downloads/new-mainxx/src/components/Navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const Navigation = ()=>{
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [resourcesDropdownOpen, setResourcesDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [studyLibraryDropdownOpen, setStudyLibraryDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [prayerRockDropdownOpen, setPrayerRockDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Prevent hydration mismatch by only using pathname after mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navigation.useEffect": ()=>{
            setMounted(true);
        }
    }["Navigation.useEffect"], []);
    // Use empty string for pathname during SSR to prevent hydration mismatch
    const currentPathname = mounted ? pathname : '';
    const aboutTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resourcesTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const studyLibraryTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prayerRockTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleAboutMouseEnter = ()=>{
        if (aboutTimeoutRef.current) {
            clearTimeout(aboutTimeoutRef.current);
        }
        setAboutDropdownOpen(true);
    };
    const handleAboutMouseLeave = ()=>{
        aboutTimeoutRef.current = setTimeout(()=>{
            setAboutDropdownOpen(false);
        }, 150);
    };
    const handleResourcesMouseEnter = ()=>{
        if (resourcesTimeoutRef.current) {
            clearTimeout(resourcesTimeoutRef.current);
        }
        setResourcesDropdownOpen(true);
    };
    const handleResourcesMouseLeave = ()=>{
        resourcesTimeoutRef.current = setTimeout(()=>{
            setResourcesDropdownOpen(false);
        }, 150);
    };
    const handleStudyLibraryMouseEnter = ()=>{
        if (studyLibraryTimeoutRef.current) {
            clearTimeout(studyLibraryTimeoutRef.current);
        }
        setStudyLibraryDropdownOpen(true);
    };
    const handleStudyLibraryMouseLeave = ()=>{
        studyLibraryTimeoutRef.current = setTimeout(()=>{
            setStudyLibraryDropdownOpen(false);
        }, 150);
    };
    const handlePrayerRockMouseEnter = ()=>{
        if (prayerRockTimeoutRef.current) {
            clearTimeout(prayerRockTimeoutRef.current);
        }
        setPrayerRockDropdownOpen(true);
    };
    const handlePrayerRockMouseLeave = ()=>{
        prayerRockTimeoutRef.current = setTimeout(()=>{
            setPrayerRockDropdownOpen(false);
        }, 150);
    };
    const navItems = [
        {
            path: '/',
            label: 'Home'
        },
        {
            path: '/contact',
            label: 'Contact Us'
        }
    ];
    const aboutItems = [
        {
            path: '/my-story',
            label: 'My Story'
        },
        {
            path: '/why-this-ministry',
            label: 'Why This Ministry'
        },
        {
            path: '/about',
            label: 'About Us'
        }
    ];
    const resourceItems = [
        {
            path: '/crisis-help',
            label: 'Crisis Help'
        },
        {
            path: '/healing-pathways',
            label: 'Healing Pathways'
        },
        {
            path: '/daily-fire',
            label: 'Daily Fire'
        },
        {
            path: '/ministry-hub',
            label: 'Ministry Hub'
        }
    ];
    const studyLibraryItems = [
        {
            path: '/bible-reader',
            label: 'Bible Reader'
        },
        {
            path: '/bible-study',
            label: 'Bible Study Hub'
        },
        {
            path: '/mary-magdalene-apologetic',
            label: 'Mary Magdalene Apologetic'
        },
        {
            path: '/sda-commentary-search',
            label: 'SDA Commentary'
        }
    ];
    const prayerRockItems = [
        {
            path: '/prayer-rock-story',
            label: 'The Story (What is it?)'
        },
        {
            path: '/prayer-rock',
            label: 'The Archive (Testimonies)'
        },
        {
            path: '/submit-prayer',
            label: 'Submit a Prayer'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg z-50 transition-all duration-300 border-b border-white/20 dark:border-gray-700/50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center space-x-2 group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                                    className: "h-8 w-8 text-flame-500 group-hover:text-flame-600 transition-colors duration-200"
                                }, void 0, false, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-serif font-semibold text-xl text-gray-800 dark:text-white group-hover:text-flame-600 dark:group-hover:text-flame-400 transition-colors duration-200",
                                    children: "Shame to Flame"
                                }, void 0, false, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:flex items-center space-x-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPathname === '/' ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                    children: "Home"
                                }, void 0, false, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    onMouseEnter: handleAboutMouseEnter,
                                    onMouseLeave: handleAboutMouseLeave,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${aboutItems.some((item)=>currentPathname === item.path) ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "About"
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: `h-4 w-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 140,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute top-full left-0 pt-1 transition-all duration-200 ${aboutDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1",
                                                children: aboutItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.path,
                                                        className: `block px-4 py-2 text-sm transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                        children: item.label
                                                    }, item.path, false, {
                                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    onMouseEnter: handleResourcesMouseEnter,
                                    onMouseLeave: handleResourcesMouseLeave,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${resourceItems.some((item)=>currentPathname === item.path) ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Resources"
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: `h-4 w-4 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute top-full left-0 pt-1 transition-all duration-200 ${resourcesDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1",
                                                children: resourceItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.path,
                                                        className: `block px-4 py-2 text-sm transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                        children: item.label
                                                    }, item.path, false, {
                                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    onMouseEnter: handleStudyLibraryMouseEnter,
                                    onMouseLeave: handleStudyLibraryMouseLeave,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${studyLibraryItems.some((item)=>currentPathname === item.path) ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Study Library"
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: `h-4 w-4 transition-transform duration-200 ${studyLibraryDropdownOpen ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 208,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute top-full left-0 pt-1 transition-all duration-200 ${studyLibraryDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1",
                                                children: studyLibraryItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.path,
                                                        className: `block px-4 py-2 text-sm transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                        children: item.label
                                                    }, item.path, false, {
                                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 219,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    onMouseEnter: handlePrayerRockMouseEnter,
                                    onMouseLeave: handlePrayerRockMouseLeave,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${prayerRockItems.some((item)=>currentPathname === item.path) ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Prayer Rock"
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: `h-4 w-4 transition-transform duration-200 ${prayerRockDropdownOpen ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 242,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute top-full left-0 pt-1 transition-all duration-200 ${prayerRockDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1",
                                                children: prayerRockItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.path,
                                                        className: `block px-4 py-2 text-sm transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                        children: item.label
                                                    }, item.path, false, {
                                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 253,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                            lineNumber: 252,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                navItems.slice(1).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.path,
                                        className: `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                        children: item.label
                                    }, item.path, false, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:hidden flex items-center space-x-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsOpen(!isOpen),
                                className: "p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30 transition-colors duration-200",
                                children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-6 w-6"
                                }, void 0, false, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 291,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    className: "h-6 w-6"
                                }, void 0, false, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 291,
                                    columnNumber: 53
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 animate-fade-in",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2 pt-2 pb-3 space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                onClick: ()=>setIsOpen(false),
                                className: `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${currentPathname === '/' ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                lineNumber: 299,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setAboutDropdownOpen(!aboutDropdownOpen),
                                        className: "w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30 transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "About"
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 316,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: `h-4 w-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 317,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    aboutDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pl-4 space-y-1 mt-1",
                                        children: aboutItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.path,
                                                onClick: ()=>setIsOpen(false),
                                                className: `block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                children: item.label
                                            }, item.path, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 322,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 320,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setResourcesDropdownOpen(!resourcesDropdownOpen),
                                        className: "w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30 transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Resources"
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 344,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: `h-4 w-4 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 345,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 340,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    resourcesDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pl-4 space-y-1 mt-1",
                                        children: resourceItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.path,
                                                onClick: ()=>setIsOpen(false),
                                                className: `block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                children: item.label
                                            }, item.path, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 350,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 348,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                lineNumber: 339,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setStudyLibraryDropdownOpen(!studyLibraryDropdownOpen),
                                        className: "w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30 transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Study Library"
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 372,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: `h-4 w-4 transition-transform duration-200 ${studyLibraryDropdownOpen ? 'rotate-180' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 373,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 368,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    studyLibraryDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pl-4 space-y-1 mt-1",
                                        children: studyLibraryItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.path,
                                                onClick: ()=>setIsOpen(false),
                                                className: `block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                children: item.label
                                            }, item.path, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 378,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 376,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                lineNumber: 367,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setPrayerRockDropdownOpen(!prayerRockDropdownOpen),
                                        className: "w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30 transition-all duration-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Prayer Rock"
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 400,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: `h-4 w-4 transition-transform duration-200 ${prayerRockDropdownOpen ? 'rotate-180' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 401,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 396,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    prayerRockDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pl-4 space-y-1 mt-1",
                                        children: prayerRockItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.path,
                                                onClick: ()=>setIsOpen(false),
                                                className: `block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                                children: item.label
                                            }, item.path, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                                lineNumber: 406,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                        lineNumber: 404,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                lineNumber: 395,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            navItems.slice(1).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.path,
                                    onClick: ()=>setIsOpen(false),
                                    className: `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${currentPathname === item.path ? 'bg-flame-100 dark:bg-flame-900/50 text-flame-700 dark:text-flame-300' : 'text-gray-600 dark:text-gray-300 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-flame-50 dark:hover:bg-flame-900/30'}`,
                                    children: item.label
                                }, item.path, false, {
                                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                                    lineNumber: 424,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                        lineNumber: 298,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
                    lineNumber: 297,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/downloads/new-mainxx/src/components/Navigation.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navigation, "GOqtad1Av2casnCu48qUKv0wj7c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Navigation;
const __TURBOPACK__default__export__ = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/downloads/new-mainxx/src/components/VideoBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const VideoBackground = ()=>{
    _s();
    const [videoLoaded, setVideoLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [videoError, setVideoError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VideoBackground.useEffect": ()=>{
            const video = videoRef.current;
            if (!video) return;
            const handleLoadedData = {
                "VideoBackground.useEffect.handleLoadedData": ()=>{
                    console.log('Video loaded successfully');
                    setVideoLoaded(true);
                    setVideoError(false);
                    // Force play the video
                    video.currentTime = 0;
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.then({
                            "VideoBackground.useEffect.handleLoadedData": ()=>{
                                console.log('Video autoplay started successfully');
                            }
                        }["VideoBackground.useEffect.handleLoadedData"]).catch({
                            "VideoBackground.useEffect.handleLoadedData": (error)=>{
                                console.log('Autoplay prevented by browser, trying to enable:', error);
                                // Try again after a short delay
                                setTimeout({
                                    "VideoBackground.useEffect.handleLoadedData": ()=>{
                                        video.play().catch({
                                            "VideoBackground.useEffect.handleLoadedData": (e)=>console.log('Second play attempt failed:', e)
                                        }["VideoBackground.useEffect.handleLoadedData"]);
                                    }
                                }["VideoBackground.useEffect.handleLoadedData"], 100);
                            }
                        }["VideoBackground.useEffect.handleLoadedData"]);
                    }
                }
            }["VideoBackground.useEffect.handleLoadedData"];
            const handleError = {
                "VideoBackground.useEffect.handleError": (e)=>{
                    console.error('Video failed to load:', e);
                    setVideoError(true);
                    setVideoLoaded(false);
                }
            }["VideoBackground.useEffect.handleError"];
            const handleCanPlay = {
                "VideoBackground.useEffect.handleCanPlay": ()=>{
                    console.log('Video can start playing');
                    if (video.paused) {
                        video.play().catch({
                            "VideoBackground.useEffect.handleCanPlay": (e)=>console.log('CanPlay event play failed:', e)
                        }["VideoBackground.useEffect.handleCanPlay"]);
                    }
                }
            }["VideoBackground.useEffect.handleCanPlay"];
            const handleEnded = {
                "VideoBackground.useEffect.handleEnded": ()=>{
                    // Ensure loop continues
                    video.currentTime = 0;
                    video.play().catch({
                        "VideoBackground.useEffect.handleEnded": (e)=>console.log('Loop restart failed:', e)
                    }["VideoBackground.useEffect.handleEnded"]);
                }
            }["VideoBackground.useEffect.handleEnded"];
            const handleLoadedMetadata = {
                "VideoBackground.useEffect.handleLoadedMetadata": ()=>{
                    console.log('Video metadata loaded');
                    // Try to play once metadata is loaded
                    if (video.paused) {
                        video.play().catch({
                            "VideoBackground.useEffect.handleLoadedMetadata": (e)=>console.log('Metadata load play attempt failed:', e)
                        }["VideoBackground.useEffect.handleLoadedMetadata"]);
                    }
                }
            }["VideoBackground.useEffect.handleLoadedMetadata"];
            // Set video source explicitly
            video.load();
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('error', handleError);
            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('canplaythrough', handleCanPlay);
            video.addEventListener('ended', handleEnded);
            return ({
                "VideoBackground.useEffect": ()=>{
                    video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    video.removeEventListener('loadeddata', handleLoadedData);
                    video.removeEventListener('error', handleError);
                    video.removeEventListener('canplay', handleCanPlay);
                    video.removeEventListener('canplaythrough', handleCanPlay);
                    video.removeEventListener('ended', handleEnded);
                }
            })["VideoBackground.useEffect"];
        }
    }["VideoBackground.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 w-full h-full overflow-hidden z-0",
        children: [
            !videoError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                ref: videoRef,
                autoPlay: true,
                muted: true,
                loop: true,
                playsInline: true,
                preload: "auto",
                className: `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`,
                style: {
                    pointerEvents: 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                        src: "/shame-to-flame.mp4",
                        type: "video/mp4"
                    }, void 0, false, {
                        fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Your browser does not support the video tag."
                ]
            }, void 0, true, {
                fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 bg-gradient-to-br from-sky-900 via-purple-900 to-flame-900 animate-gradient-shift transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`
            }, void 0, false, {
                fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-20' : 'opacity-30'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stars"
                    }, void 0, false, {
                        fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stars2"
                    }, void 0, false, {
                        fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stars3"
                    }, void 0, false, {
                        fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40 dark:bg-black/60"
            }, void 0, false, {
                fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/40 dark:via-transparent dark:to-black/50"
            }, void 0, false, {
                fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/downloads/new-mainxx/src/components/VideoBackground.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(VideoBackground, "UlTjCL37fMpGvE/g5IDFVw6wYTs=");
_c = VideoBackground;
const __TURBOPACK__default__export__ = VideoBackground;
var _c;
__turbopack_context__.k.register(_c, "VideoBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/downloads/new-mainxx/src/lib/pwa-install-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared store for PWA install prompt across components
__turbopack_context__.s([
    "getDeferredPrompt",
    ()=>getDeferredPrompt,
    "setDeferredPrompt",
    ()=>setDeferredPrompt,
    "subscribe",
    ()=>subscribe
]);
let deferredPrompt = null;
const listeners = new Set();
function setDeferredPrompt(prompt) {
    deferredPrompt = prompt;
    listeners.forEach((listener)=>listener(prompt));
}
function getDeferredPrompt() {
    return deferredPrompt;
}
function subscribe(listener) {
    listeners.add(listener);
    // Immediately call with current value
    listener(deferredPrompt);
    return ()=>{
        listeners.delete(listener);
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$lib$2f$pwa$2d$install$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/src/lib/pwa-install-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const PWAInstallPrompt = ()=>{
    _s();
    const [deferredPrompt, setDeferredPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPrompt, setShowPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PWAInstallPrompt.useEffect": ()=>{
            // Check if app is already installed
            const checkInstalled = {
                "PWAInstallPrompt.useEffect.checkInstalled": ()=>{
                    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
                        setIsInstalled(true);
                    }
                }
            }["PWAInstallPrompt.useEffect.checkInstalled"];
            checkInstalled();
            // Subscribe to shared prompt store (PWAWrapper captures the event)
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$lib$2f$pwa$2d$install$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribe"])({
                "PWAInstallPrompt.useEffect.unsubscribe": (prompt)=>{
                    setDeferredPrompt(prompt);
                    if (prompt && !isInstalled) {
                        setTimeout({
                            "PWAInstallPrompt.useEffect.unsubscribe": ()=>{
                                if (!isInstalled && ("TURBOPACK compile-time value", "object") !== 'undefined' && !localStorage.getItem('pwa-install-dismissed')) {
                                    setShowPrompt(true);
                                }
                            }
                        }["PWAInstallPrompt.useEffect.unsubscribe"], 3000);
                    }
                }
            }["PWAInstallPrompt.useEffect.unsubscribe"]);
            // Listen for app installed event
            const handleAppInstalled = {
                "PWAInstallPrompt.useEffect.handleAppInstalled": ()=>{
                    setIsInstalled(true);
                    setShowPrompt(false);
                    setDeferredPrompt(null);
                    console.log('PWA was installed');
                }
            }["PWAInstallPrompt.useEffect.handleAppInstalled"];
            if ("TURBOPACK compile-time truthy", 1) {
                window.addEventListener('appinstalled', handleAppInstalled);
            }
            return ({
                "PWAInstallPrompt.useEffect": ()=>{
                    unsubscribe();
                    if ("TURBOPACK compile-time truthy", 1) {
                        window.removeEventListener('appinstalled', handleAppInstalled);
                    }
                }
            })["PWAInstallPrompt.useEffect"];
        }
    }["PWAInstallPrompt.useEffect"], [
        isInstalled
    ]);
    const handleInstallClick = async ()=>{
        const prompt = deferredPrompt || (("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$lib$2f$pwa$2d$install$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeferredPrompt"])() : "TURBOPACK unreachable");
        if (!prompt) return;
        try {
            await prompt.prompt();
            const { outcome } = await prompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setDeferredPrompt(null);
            setShowPrompt(false);
        } catch (error) {
            console.error('Error during install prompt:', error);
        }
    };
    const handleDismiss = ()=>{
        setShowPrompt(false);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('pwa-install-dismissed', 'true');
        }
    };
    // Don't show if already installed or no prompt available
    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 p-3.5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start space-x-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 bg-gradient-to-br from-flame-400 to-flame-600 rounded-full flex items-center justify-center flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                            className: "h-4 w-4 text-white"
                        }, void 0, false, {
                            fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-800 dark:text-white text-xs",
                                children: "Install Shame to Flame"
                            }, void 0, false, {
                                fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 dark:text-gray-300 text-xs mt-1 leading-relaxed",
                                children: "Add our ministry app to your home screen for quick access to healing resources, even offline."
                            }, void 0, false, {
                                fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2 mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleInstallClick,
                                        className: "inline-flex items-center px-6 py-1.5 bg-flame-600 hover:bg-flame-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 whitespace-nowrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "h-3 w-3 mr-1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                                                lineNumber: 111,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Install App"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleDismiss,
                                        className: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs whitespace-nowrap",
                                        children: "Not now"
                                    }, void 0, false, {
                                        fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDismiss,
                        className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PWAInstallPrompt, "TLP+Da+iYWRHVAzKIDGB8JIQ90c=");
_c = PWAInstallPrompt;
const __TURBOPACK__default__export__ = PWAInstallPrompt;
var _c;
__turbopack_context__.k.register(_c, "PWAInstallPrompt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/downloads/new-mainxx/src/components/PWAWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PWAWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$components$2f$PWAInstallPrompt$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/src/components/PWAInstallPrompt.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$lib$2f$pwa$2d$install$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/src/lib/pwa-install-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function PWAWrapper() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PWAWrapper.useEffect": ()=>{
            // Register service worker (works in both dev and production on localhost/HTTPS)
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                }).then({
                    "PWAWrapper.useEffect": (registration)=>{
                        console.log('✅ Service Worker registered successfully:', registration.scope);
                    }
                }["PWAWrapper.useEffect"]).catch({
                    "PWAWrapper.useEffect": (error)=>{
                        console.error('❌ Service Worker registration failed:', error);
                    }
                }["PWAWrapper.useEffect"]);
            }
            // ONE component captures the event and shares it
            const handleBeforeInstallPrompt = {
                "PWAWrapper.useEffect.handleBeforeInstallPrompt": (e)=>{
                    e.preventDefault();
                    const promptEvent = e;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$lib$2f$pwa$2d$install$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDeferredPrompt"])(promptEvent);
                    console.log('✅ beforeinstallprompt event captured and shared');
                }
            }["PWAWrapper.useEffect.handleBeforeInstallPrompt"];
            if ("TURBOPACK compile-time truthy", 1) {
                window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            }
            return ({
                "PWAWrapper.useEffect": ()=>{
                    if ("TURBOPACK compile-time truthy", 1) {
                        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                    }
                }
            })["PWAWrapper.useEffect"];
        }
    }["PWAWrapper.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$src$2f$components$2f$PWAInstallPrompt$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/downloads/new-mainxx/src/components/PWAWrapper.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
_s(PWAWrapper, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = PWAWrapper;
var _c;
__turbopack_context__.k.register(_c, "PWAWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/downloads/new-mainxx/src/components/ClientFooter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/downloads/new-mainxx/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
'use client'; // ← makes this a Client Component
;
;
// Dynamically load your real Footer, only on client
const DynamicFooter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/downloads/new-mainxx/src/components/Footer.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/downloads/new-mainxx/src/components/Footer.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = DynamicFooter;
function ClientFooter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$downloads$2f$new$2d$mainxx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DynamicFooter, {}, void 0, false, {
        fileName: "[project]/downloads/new-mainxx/src/components/ClientFooter.tsx",
        lineNumber: 9,
        columnNumber: 10
    }, this);
}
_c1 = ClientFooter;
var _c, _c1;
__turbopack_context__.k.register(_c, "DynamicFooter");
__turbopack_context__.k.register(_c1, "ClientFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=downloads_new-mainxx_src_8deed942._.js.map