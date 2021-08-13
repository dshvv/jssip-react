const path = require("path");
const CracoLessPlugin = require("craco-less");
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    webpack: {
        alias: {
            '@': resolve("src"), //使用@替换src
            'components': resolve("src/components")  //components替换src/components
        }
    },
    plugins: [{ plugin: CracoLessPlugin }],
}