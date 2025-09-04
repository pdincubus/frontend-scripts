import gulp from "gulp";

import colours from "ansi-colors";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import size from "gulp-size";
import calc from "postcss-calc";
import extendRule from "postcss-extend-rule";
import lightningCss from "postcss-lightningcss";
import nested from "postcss-nested";
import partialImports from "postcss-import";
import presetEnv from "postcss-preset-env";
import sortMediaQueries from "postcss-sort-media-queries";
import systemUiFont from "postcss-font-family-system-ui";
import reporter from "postcss-reporter";
import ts from "gulp-typescript";

const tsProject = ts.createProject('tsconfig.json');

function watchCss(done) {
    const cssFiles = "src/css/**/*.css";
    const watcher = gulp.watch(cssFiles);

    watcher.on("change", function (path, stats) {
        console.log(`PostCSS watcher fired for: ${path}`);

        compilePostCss(done);
    });

    done();
}

function watchTs(done) {
    const tsFiles = "src/ts/**/*.ts";
    const watcher = gulp.watch(tsFiles);

    watcher.on("change", function (path, stats) {
        console.log(`TypeScript watcher fired for: ${path}`);

        compileTypescript();
    });

    done();
}

function compilePostCss(done) {
    const entries = [
        {
            inputFile: "src/css/index.css",
            outputFile: "site.css"
        },
        {
            inputFile: "src/css/checkout.css",
            outputFile: "checkout.css"
        },
        {
            inputFile: "src/css/global.css",
            outputFile: "global.css"
        },
        {
            inputFile: "src/css/variables.css",
            outputFile: "variables.css"
        },
    ];

    const outputDest = "dist/css";

    entries.forEach(entry => {
        const pipeTitle = `${colours.magenta("[CSS]")} ${colours.green("[" + entry.outputFile + "]")}`;

        return gulp
            .src(entry.inputFile, { sourcemaps: true })
            .pipe(
                postcss([
                    partialImports,
                    calc,
                    presetEnv({
                        features: {
                            "cascade-layers": false
                        }
                    }),
                    nested,
                    systemUiFont,
                    extendRule,
                    sortMediaQueries({
                        sort: "mobile-first",
                    }),
                    lightningCss,
                    reporter({
                        clearReportedMessages: true,
                        clearAllMessages: true,
                        throwError: false,
                        positionless: "last",
                    }),
                ]),
            )
            .pipe(rename(entry.outputFile))
            .pipe(
                size({
                    title: pipeTitle,
                    showFiles: true,
                    showTotal: false,
                }),
            )
            .pipe(
                gulp.dest(outputDest, { sourcemaps: "." })
            )
        ;
    });

    done();
}

function compileTypescript() {
    return tsProject
        .src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('dist/js'));
}

gulp.task("default", compilePostCss, compileTypescript);
gulp.task("dev", gulp.series(compilePostCss, watchCss, compileTypescript, watchTs));