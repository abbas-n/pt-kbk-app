
export async function FetchApi(url, method = 'POST', withToken = false, body = '') {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (withToken) {
        let bearer = 'Bearer ' + localStorage.getItem('utoken');
        headers = {
            'authorization': bearer,
            'Content-Type': 'application/json',
        }
    }
    try {
        let res;
        if (method === 'POST') {
            res = await fetch('https://safirapi.kalaresan1.ir/api/v1' + url, {
                method: method,
                headers: headers,
                credentials: 'include',
                body: body,
                next: { revalidate: 0 },
            });
        } else if (method === 'GET') {
            res = await fetch('https://safirapi.kalaresan1.ir/api/v1' + url, {
                method: method,
                headers: headers,
                credentials: 'include',
                next: { revalidate: 0 },
            });
        }

        const data = await res.json();
        const status = res.status;
        if (status === 401 && (data.message === 'User is not authorized or token is missing' || data.message === 'User is not authorized')) {
            return refreshTokens(url, method, withToken, body);
        }
        return { data, status };
    } catch (error) {
        console.log(error);
    }


}

export async function refreshTokens(url, method = 'POST', withToken = false, body = '') {
    let res = await fetch('https://safirapi.kalaresan1.ir/api/v1/auth/refreshToken', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    const data = await res.json();
    const status = res.status;
    if (status == 200) {
        localStorage.setItem('utoken', data.accessToken);
        let originalReq = FetchApi(url, method, withToken, body);
        return originalReq;
    } else {
        return { data: { message: 'اعتبار دسترسی به پایان رسیده است' }, status: '401' };
    }

}
export async function checkTokenValidation() {
    let res = await fetch('https://safirapi.kalaresan1.ir/api/v1/auth/current', {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('utoken'),
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const status = res.status;
    if (status !== 200) {
        // localStorage.clear();
        return false;
    }
    return true;

}

export function onlyNumber(input) {
    const persianToEnglishMap = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9'
    };

    input = input.replace(/[۰-۹]/g, (match) => persianToEnglishMap[match]);
    return input.replace(/[^0-9\.]/g, '');
}

export function thousandDivider(input) {
    if (input > 0) {
        input = parseInt(input);
        input = input.toLocaleString();
    }
    return input;
}

export function escapeHtml(string) {
    // var entityMap = {
    //     '&': '&amp;',
    //     '<': '&lt;',
    //     '>': '&gt;',
    //     '"': '&quot;',
    //     "'": '&#39;',
    //     '/': '&#x2F;',
    //     '`': '&#x60;',
    //     '=': '&#x3D;'
    // };
    var entityMap = {
        '&': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        '/': '',
        '`': '',
        '=': ''
    };
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
        return entityMap[s];
    });
}

export function toFarsiNumber(input) {
    if (input.length > 0) {
        const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return input
            .toString()
            .replace(/\d/g, x => farsiDigits[x]);
    } else {
        return input;
    }
}

export function getNextDay(dayTogo) {
    const currentDate = new Date();
    let needTime = dayTogo * (24 * 60 * 60 * 1000);
    const nextDate = new Date(currentDate.getTime() + needTime); // Add 1 day (24 hours) to the current date

    // Convert the next date to the Persian calendar
    const persianOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        calendar: 'persian'
    };
    const nextPersianDate = nextDate.toLocaleDateString('fa-IR', persianOptions);

    return nextPersianDate;
}

export function getNextDayWithTime(thisTime,dayTogo) {
    const currentDate = new Date(thisTime);
    let needTime = dayTogo * (24 * 60 * 60 * 1000);
    const nextDate = new Date(currentDate.getTime() + needTime); // Add 1 day (24 hours) to the current date

    // Convert the next date to the Persian calendar
    const persianOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        calendar: 'persian'
    };
    const nextPersianDate = nextDate.toLocaleDateString('fa-IR', persianOptions);

    return nextPersianDate;
}

export const delay = (ms) => new Promise(res => setTimeout(res, ms));
