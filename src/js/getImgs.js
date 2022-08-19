import axios from 'axios';

const API_KEY = "29186730-3f44e5d7f92932d3e32146242";
const ORIENTATION = "horizontal";
const IMAGE_TYPE = "photo";

const axios = require('axios');

export const getImgs = async (text, page = 1) => {
    const res = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${text}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&page=${page}&per_page=40`)
    return res.data;
};
