const env = (typeof window !== 'undefined') ? window.env : process.env.NODE_ENV;
export default require(`./${env}`);
