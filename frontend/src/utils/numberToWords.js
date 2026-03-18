/**
 * Utility to convert numbers to Arabic words.
 * Specifically tailored for currency (USD).
 */

const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
const thousands = ['', 'ألف', 'ألفان', 'ثلاثة آلاف', 'أربعة آلاف', 'خمسة آلاف', 'ستة آلاف', 'سبعة آلاف', 'ثمانية آلاف', 'تسعة آلاف', 'عشرة آلاف'];

export const numberToArabicWords = (n) => {
    if (n === 0) return 'صفر';

    let words = '';

    if (n >= 1000) {
        const thousandPart = Math.floor(n / 1000);
        if (thousandPart === 1) words += 'ألف ';
        else if (thousandPart === 2) words += 'ألفان ';
        else if (thousandPart <= 10) words += thousands[thousandPart] + ' ';
        else words += numberToArabicWords(thousandPart) + ' ألف ';
        n %= 1000;
        if (n > 0) words += 'و ';
    }

    if (n >= 100) {
        words += hundreds[Math.floor(n / 100)] + ' ';
        n %= 100;
        if (n > 0) words += 'و ';
    }

    if (n >= 20) {
        words += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
        if (n > 0) words += 'و ' + ones[n] + ' ';
    } else if (n > 0) {
        words += ones[n] + ' ';
    }

    return words.trim();
};

const currencyNames = {
    'USD': { main: 'دولار أمريكي', sub: 'سنتاً' },
    'EUR': { main: 'يورو', sub: 'سنتاً' },
    'GBP': { main: 'جنيه إسترليني', sub: 'بنس' },
    'AED': { main: 'درهم إماراتي', sub: 'فلساً' },
    'SAR': { main: 'ريال سعودي', sub: 'هللة' },
    'IQD': { main: 'دينار عراقي', sub: 'فلس' },
};

export const amountToWords = (amount, currency = 'USD') => {
    const cur = currencyNames[currency] || currencyNames['USD'];
    const num = Math.floor(amount);
    const fraction = Math.round((amount - num) * 100);

    let result = numberToArabicWords(num) + ' ' + cur.main;

    if (fraction > 0) {
        result += ' و ' + numberToArabicWords(fraction) + ' ' + cur.sub;
    }

    return result + ' لا غير';
};
