# Osoc-Interlink

All the Open Summer Of Code data is open (as is fitting), but there's no way to view all the projects a person has worked on. So, uh, now there is!

## Getting started
There's a live version at https://denperidge.github.io/osoc-interlink!

But if you want to run this project locally, simply set it up with
```bash
git clone https://github.com/Denperidge/osoc-interlink.git
cd osoc-interlink/
npm install
npm start
```


## (Old) branches:
- main: Full rework without mongodb/mongoose, so this could work statically
- mongodb: Basic data parsing, but stopped due to mongodb's default driver referencing to other documents being less solid than mongoose
- mongoose: Working data parsing, but stopped due to wanting this project to work static

## License
This project is licensed under the [MIT License](LICENSE).
