const sonarqubeScanner = require("sonarqube-scanner");
sonarqubeScanner(
    {
        serverUrl: "https://sgdevops.saint-gobain.com/sonarqube",
        token: "0325fdc84892d4f05a01321ce516fdeb12bc80dc",
        projectKey: "indec4-neo",
        options: {
            "sonar.sources": "./src",
            "sonar.exclusions": "**/__tests__/**",
            //"sonar.tests": "./src/__tests__",
            //"sonar.test.inclusions": "./src/__tests__/**/*.test.tsx,./src/__tests__/**/*.test.ts",
            //"sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
            //"sonar.testExecutionReportPaths": "reports/test-report.xml",
            "sonar.projectName": "Neo Web",
            "sonar.projectVersion": "2.1",
            "sonar.projectKey": "indec4-neo"
        },
    },
    () => { },
);