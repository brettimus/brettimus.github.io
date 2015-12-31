const LOCAL_STORAGE_NAMESPACE = "shorts-app::";

const prefix = (key) => {
    return LOCAL_STORAGE_NAMESPACE + key;
};

const serialize = (value) => {
    return JSON.stringify(value)
};

const deserialize = (value) => {
    return JSON.parse(value)
};

const get = (key) => {
    key = prefix(key);
    let value = window.localStorage.getItem(key);
    return deserialize(value);                
};

const remove = (key) => {
    key = prefix(key);
    window.localStorage.removeItem(key);
};

const save = (key, value) => {
    key = prefix(key);
    value = serialize(value);
    window.localStorage.setItem(key, value);
};

module.exports = { get, remove, save };