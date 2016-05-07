# Skype-Electron
An Electron Skype app designed for use on Linux systems.

## Prerequisites
Skype-Electron comes with a build script to compile the code for you.
In order for the script to run, `electron-packager` must first be installed.

Install `electron-packager` with the following command:

```bash
npm install -g electron-packager
```

Then, run the build script with the following command:

```bash
./build.sh
OR
bash build.sh
```

If you want to build with a version of Electron that is different from what is
in the latest commit, open `build.sh` with your favorite text editor and change
the value of `VERSION=` to the build you want.
