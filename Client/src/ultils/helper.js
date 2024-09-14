import icons from "./icons"
const { BsStar, BsStarFill } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()

export const renderStartFromNumber = (number, size) => {
    const roundedNumber = Math.round(Number(number));
    if (!roundedNumber) return null; // Nếu number không phải là một số, trả về null
    const stars = [];

    for (let i = 0; i < roundedNumber; i++) stars.push(<BsStarFill color="orange" size={size || 16} key={i} />);
    for (let i = roundedNumber; i < 5; i++) stars.push(<BsStar color="orange" size={size || 16} key={i} />);
    if (roundedNumber === 0 || roundedNumber === null) { // Kiểm tra xem number có bằng 0 hoặc null không
        for (let i = 0; i < 5; i++) stars.push(<BsStar color="orange" size={size || 16} key={i} />);
    }
    return stars; // Trả về mảng chứa các biểu tượng sao
};

export const invalidate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], message: 'Requied this fields.' }])
        }
    }

    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^(.+)@(\S+)$/
                if (!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], message: 'Input is Email.' }])
                }
                break
            default:
                break
        }
    }

    return invalids
}

export const formatPrice = number => Math.round(number / 1000) * 1000

export const generateRange = (star, end) => {
    const length = end + 1 - star
    return Array.from({ length }, (_, index) => star + index)
}
export const fileTobase64 = (file) => {
    if (!file) return
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export const HideEmail = (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return maskedUsername + '@' + domain;
};

export const HidePhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Xóa tất cả các ký tự không phải số khỏi chuỗi số điện thoại
    const lastFourDigits = cleaned.slice(-2); // Lấy 4 chữ số cuối cùng
    const hiddenPart = '*'.repeat(cleaned.length - 2); // Tạo một chuỗi dấu '*' có chiều dài bằng phần còn lại của chuỗi số điện thoại
    return hiddenPart + lastFourDigits; // Kết hợp phần đã ẩn và 4 chữ số cuối cùng
};

export const formatNumber = (number) => {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1) + " N";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1) + " TR";
    }
}

export const truncateString = (str, num) => {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + "...";
};