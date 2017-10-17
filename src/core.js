let uid = 0;
export let has = (obj, prop) => {
    return obj.hasOwnProperty(prop);
}
export let isFun = obj => typeof obj === 'function' || obj instanceof Function;
export let isPromise = obj => typeof obj === 'object' && isFun(obj.then);
export let toPromise = (fun, args, ctx) => {
    if (isFun(fun)) {
        var result = fun.apply(ctx || null, args);
        if (isPromise(result)) {
            return result;
        } else {
            return !!result ? Promise.resolve() : Promise.reject();
        }
    } else {
        return Promise.resolve();
    }
}
export let err = msg => { throw new Error(`[ISwitch Error] ${msg}`); }
export let warn = msg => { console.warn(`[ISwitch Warn] ${msg}`); }

let validateOptions = ops => {
    if (!has(ops, 'onValue') || !has(ops, 'offValue')) {
        err(`配置项onValue和offValue不得为空`);
    }
    if (ops.onValue === ops.offValue) {
        err(`配置项onValue和offValue不能是相等的值`);
    }
}

export function ISwitch(options) {
    let iSwitch = {
        id: 'isw' + uid++,
        ts: new Date(),
        checked: false
    }

    var self = this;
    let isWillChange = willValue => {
        return willValue !== iSwitch.value;
    }
    let changeValue = value => {
        setValue(value);
        iSwitch.onChange(value);
    }
    let setValue = value => {
        iSwitch.value = value;
        iSwitch.checked = iSwitch.value === iSwitch.onValue;
        if (iSwitch.provider && isFun(iSwitch.provider.setValue)) {
            iSwitch.provider.setValue(value, iSwitch.checked);
        }
    }
    let switchChange = willValue => {
        return new Promise((resolve, reject) => {
            if (isWillChange(willValue)) {
                if (iSwitch.beforeChange && isFun(iSwitch.beforeChange)) {
                    toPromise(iSwitch.beforeChange, [willValue]).then(() => {
                        changeValue(willValue);
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                } else {
                    changeValue(willValue);
                    resolve();
                }
            } else {
                resolve();
            }
        })
    }

    this.setOptions = function (ops) {
        if (typeof ops === 'object') {
            Object.assign(iSwitch, ISwitch.defaultOptions, ops);
        }
        validateOptions(iSwitch);
    }

    this.setOptions(options);

    if (iSwitch.value !== iSwitch.onValue && iSwitch.value !== iSwitch.offValue) {
        warn('value值没有设置或者不在范围内，已经默认设置为offValue');
        setValue(iSwitch.offValue);
    } else {
        iSwitch.checked = iSwitch.value === iSwitch.onValue;
    }

    this.getValue = function () {
        return {
            value: iSwitch.value,
            checked: iSwitch.checked
        }
    }
    this.switchOn = function () {
        return switchChange(iSwitch.onValue);
    }
    this.switchOff = function () {
        return switchChange(iSwitch.offValue);
    }
    this.switchToggle = function () {
        return iSwitch.checked ? switchChange(iSwitch.offValue) : switchChange(iSwitch.onValue);
    }
    this.destroy = function () {
        delete iSwitch.provider;
        delete iSwitch.beforeChange;
        delete iSwitch.onChange;
        iSwitch = null;
    }
}
ISwitch.defaultOptions = {
    onText: '',
    onValue: true,
    onColor: '#64bd63',
    offText: '',
    offValue: false,
    offColor: '#fdfdfd',
    beforeChange: null,
    onChange: null,
    delay: 300,
    name: '',
    value: undefined,
    size: 'default',
    loading: false,
    loadingText: 'Loading...',
    disabled: false,
    static: false,
    readonly: false,
    provider: null//特定框架需要暴露的API
};