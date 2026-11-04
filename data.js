// أنواع العقارات فقط
const propertyTypes = [
    { group: "الأراضي", options: ["ارض سكنية", "ارض تجارية", "ارض مخطط", "ارض زراعية"] },
    { group: "العمائر والمباني التجارية", options: ["عمارة سكنية", "عمارة تجارية", "مركز تجاري", "سوق تجاري"] },
    { group: "الشقق", options: ["شقة ملحق", "شقة عادية", "شقة دورين", "شقة أستوديو"] },
    { group: "الفلل", options: ["فيلا متصلة", "فيلا منفصلة", "فيلا مشتركة"] },
    { group: "الاستراحات", options: ["استراحة خاصة", "استراحة ترفهيه", "استراحة مناسبات"] },
    { group: "القصور (حسب نسبة البناء)", options: ["قصر استغلال نسبة بناء 80%", "قصر استغلال نسبة بناء 70%", "قصر استغلال نسبة بناء 60%", "قصر استغلال نسبة بناء 50%", "قصر استغلال نسبة بناء 40%", "قصر استغلال نسبة بناء 35%", "قصر استغلال نسبة بناء 30%", "قصر استغلال نسبة بناء 25%", "قصر استغلال نسبة بناء 20%"] },
    { group: "الأبراج", options: ["برج عدد أدوار 10", "برج عدد أدوار 20", "برج عدد أدوار 30"] },
    { group: "عقارات أخرى", options: ["محطة وقود", "بيت شعبي", "مستودع", "معرض", "مطعم", "محل", "شاليه", "كمباوند", "تاون هوس"] }
];

// معادلة الأتعاب
function calculateLocalFee(propertyType, area, periodType, singleYear, fromYear, toYear) {
    let baseP = 1500;
    if (propertyType.includes('فيلا')) baseP = 2500;
    if (propertyType.includes('قصر')) baseP = 8000;
    if (propertyType.includes('شقة')) baseP = 2000;

    let areaF = 1.0;
    if (area > 500 && area <= 1000) areaF = 1.2;
    else if (area > 1000) areaF = 1.5;

    let perF = 1.0;
    const currentYear = new Date().getFullYear();
    if (periodType === 'تقييم لسنة' && singleYear) {
        const yearsBack = currentYear - parseInt(singleYear);
        if (yearsBack > 0) perF = Math.min(1.0 + (yearsBack * 0.1), 3.0);
    } else if (periodType === 'تقييم بالمثل' && fromYear && toYear) {
        const oldest = Math.min(parseInt(fromYear), parseInt(toYear));
        const yearsBack = currentYear - oldest;
        const yearsCount = Math.abs(parseInt(toYear) - parseInt(fromYear)) + 1;
        perF = Math.min(1.0 + (yearsBack * 0.1) + ((yearsCount - 1) * 0.1), 3.0);
    }

    return Math.round(baseP * areaF * perF);
}