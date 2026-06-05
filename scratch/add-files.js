const xcode = require('xcode');
const fs = require('fs');

const projectPath = '/Users/ajay/Documents/ReactNativeAppProduction/apps/app/ios/App.xcodeproj/project.pbxproj';
const myProj = xcode.project(projectPath);

myProj.parse(function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // Prevent node-xcode crash when PBXVariantGroup is missing
  if (!myProj.hash.project.objects['PBXVariantGroup']) {
    myProj.hash.project.objects['PBXVariantGroup'] = {};
  }

  const groups = myProj.hash.project.objects.PBXGroup;
  const originalPaths = {};

  // Temporarily set path = 'App' for all groups named 'App' or with the target key
  for (const key in groups) {
    if (groups[key].name === 'App' || key === '13B07FAE1A68108700A75B9A') {
      originalPaths[key] = groups[key].path;
      groups[key].path = 'App';
    }
  }

  // Add files under 'App' group name, passing 'App' as the third argument and forcing correct sourcecode file types
  myProj.addHeaderFile('App/FastMathJSI.h', { lastKnownFileType: 'sourcecode.c.h' }, 'App');
  myProj.addSourceFile('App/FastMathJSI.cpp', { lastKnownFileType: 'sourcecode.cpp.cpp' }, 'App');
  myProj.addSourceFile('App/FastMathModule.mm', { lastKnownFileType: 'sourcecode.cpp.objcpp' }, 'App');

  // Add custom Turbo Module files
  myProj.addHeaderFile('App/BatteryStatus.h', { lastKnownFileType: 'sourcecode.c.h' }, 'App');
  myProj.addSourceFile('App/BatteryStatus.mm', { lastKnownFileType: 'sourcecode.cpp.objcpp' }, 'App');

  // Add custom Fabric Component files
  myProj.addHeaderFile('App/RTNCenteredText.h', { lastKnownFileType: 'sourcecode.c.h' }, 'App');
  myProj.addSourceFile('App/RTNCenteredText.mm', { lastKnownFileType: 'sourcecode.cpp.objcpp' }, 'App');
  myProj.addSourceFile('App/RCTAppDependencyProvider+AppCustom.mm', { lastKnownFileType: 'sourcecode.cpp.objcpp' }, 'App');

  // Restore original paths
  for (const key in originalPaths) {
    if (originalPaths[key] === undefined) {
      delete groups[key].path;
    } else {
      groups[key].path = originalPaths[key];
    }
  }

  // Write changes
  fs.writeFileSync(projectPath, myProj.writeSync());
  console.log('Successfully added custom native files and category to Xcode project!');
});
