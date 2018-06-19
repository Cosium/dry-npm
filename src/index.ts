#!/usr/bin/env node
import { Cli } from './cli';
import { DependencyResolver } from './dependency-resolver';
import { DryCommandInterceptor } from './dry-command-interceptor';
import { DryPackage } from './dry-package';

const cli = Cli.of(process);
const dryCommandInterceptor = new DryCommandInterceptor(cli, process);
const dependencyResolver = new DependencyResolver(cli);

DryPackage.readFromDisk(dependencyResolver)
    .buildNpmPackage()
    .then((npmPackage) => {
        npmPackage.beforeNpmRun();
        return dryCommandInterceptor.proxy().then(() => npmPackage.afterNpmRun());
    })
    .then(() => process.exit(), () => process.exit(1));
