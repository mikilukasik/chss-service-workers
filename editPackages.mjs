import { promises as fs } from "fs";

const submodulesUsed = process.env.SUBMODULES_USED.split(",");

const run = async () => {
  const servicePkg = JSON.parse(await fs.readFile("package.json", "utf-8"));
  const serviceName = servicePkg.name.replace("chss-service-", "");

  servicePkg.scripts.dev = "nodemon start.js";
  servicePkg.scripts.start = "node start.js";
  servicePkg.dependencies = {
    "babel-preset-env": "^1.7.0",
    "babel-register": "^6.26.0",
  };
  servicePkg.devDependencies = {
    "@babel/register": "^7.13.16",
  };

  await fs.writeFile(
    "package.json",
    JSON.stringify(servicePkg, null, 2),
    "utf-8"
  );

  //

  const rootPkg = JSON.parse(await fs.readFile("../package.json", "utf-8"));

  rootPkg.scripts[
    `start:${serviceName}`
  ] = `cd ./chss-service-${serviceName} && npm start`;
  rootPkg.scripts[
    `watch:${serviceName}`
  ] = `cd ./chss-service-${serviceName} && npm run dev`;

  const gatewayStartPart = "npm run start:gateway & ";
  const gatewayWatchPart = "npm run watch:gateway & ";

  rootPkg.scripts.start = `${gatewayStartPart}npm run start:${serviceName} & ${rootPkg.scripts.start.replace(
    gatewayStartPart,
    ""
  )}`;
  rootPkg.scripts.dev = `${gatewayWatchPart}npm run watch:${serviceName} & ${rootPkg.scripts.dev.replace(
    gatewayWatchPart,
    ""
  )}`;

  await fs.writeFile(
    "../package.json",
    JSON.stringify(rootPkg, null, 2),
    "utf-8"
  );

  //
  if (!submodulesUsed.length) return;

  const subModuleMoverScriptLines = (
    await fs.readFile("../move-submodule.sh", "utf-8")
  ).split("\n");

  for (const submoduleName of submodulesUsed) {
    const insertAtIndex =
      subModuleMoverScriptLines.findIndex(
        (line) => line === `sharedproject="\${PWD}/${submoduleName}"`
      ) + 1;

    subModuleMoverScriptLines.splice(
      insertAtIndex,
      0,
      ...[
        "",
        `  project="\${PWD}/chss-service-${serviceName}"`,
        `  rm -rf "\${project}/${submoduleName}"`,
        `  ln -s -- "$sharedproject" "$project"`,
      ]
    );
  }

  await fs.writeFile(
    "../move-submodule.sh",
    subModuleMoverScriptLines.join("\n"),
    "utf-8"
  );
};

run();
