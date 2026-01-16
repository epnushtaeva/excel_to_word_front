module.exports = {
  outputDir: './target',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        ws: true,
        changeOrigin: true
      }
    }
  }
};
