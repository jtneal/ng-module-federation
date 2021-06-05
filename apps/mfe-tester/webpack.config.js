const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.base.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "mfe-tester",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },   
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      
        // For remotes (please adjust)
        // name: "uiShell",
        // filename: "remoteEntry.js",
        // exposes: {
        //     './Component': './apps/ui-shell/src/app/app.component.ts',
        // },        
        
        // For hosts (please adjust)
        remotes: {
            // "pipelineComponent": "pipelineComponent@http://localhost:4210/remoteEntry.js",
            // "pricingCalcComponent": "pricingCalcComponent@http://localhost:4220/remoteEntry.js",
            // "applicationComponent": "applicationComponent@http://localhost:4230/remoteEntry.js",
        },

        shared: {
          "@angular/core": { singleton: true, strictVersion: true }, 
          "@angular/common": { singleton: true, strictVersion: true }, 
          "@angular/common/http": { singleton: true, strictVersion: true }, 
          "@angular/router": { singleton: true, strictVersion: true },

          ...sharedMappings.getDescriptors()
        }
        
    }),
    sharedMappings.getPlugin()
  ],
};
