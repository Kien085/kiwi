# Team Kiwi's Conveyor Belt Repository

Welcome to Kiwi's repository for generating a conveyor belt to build software the right way.
We have included in this repository different approaches to building our conveyor built
in order to compare and contrast the strengths and weaknesses each technology has
against the other. We compare React, Angular, Vue, and Web Components in order to determine
which technology is most compatible with our team's skills and abilities. We also compare
these technologies to provide Peter, our client, a clearer understanding on how we reached
our final decision on the technologies we decided upon.

## Build Pipeline

![High Level Build Pipeline](README_resources/build_pipeline.png?raw=true "Optional Title")

## Getting Started
To get started, clone our repository. 

```
TODO: Provide Steps how to run our different conveyor belts.
```
## Documentation Generation
For document generation, we are using ESDocs.

From ESDocs' Website:
```
ESDoc has two goals.

- To make documentation maintenance comfortable and pleasant
- To create easy-to-understand documentation.
  In order to achieve this two goals, ESDoc produces a practical document, 
  measures the coverage, integrates the test code and more.
```
To find out more about ESDocs, please visit: https://esdoc.org/manual/usage.html

We use ESDocs via its basic usage, such as:
```
/**
 * this is MyClass.
 */
export default class MyClass {
  /**
   * @param {number} a - this is a value.
   * @param {number} b - this is a value.
   * @return {number} result of the sum value.
   */
  sum(a, b){
    return a + b;
  }
}
```
A list of tags that are available can be found here: https://esdoc.org/manual/tags.html

Note: Please ensure you have ESDocs installed. If you do not have ESDocs installed,
please install by running the following commands:
```
npm install esdoc esdoc-standard-plugin
```

In order to view our docs, once you have set up the repository, run the commands
```
./node_modules/.bin/esdoc
open ./docs/index.html
```
The documentation to all our different technologies we have compared and contrasted will open
in your browser. There you may browse and read in more detail the code we wrote for each
technology.

# Use of Third Party Integration Tools

## Codacy
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8569c562e69145308e896348639cf8b7)](https://app.codacy.com/app/kiwi/kiwi?utm_source=github.com&utm_medium=referral&utm_content=aabadill/kiwi&utm_campaign=badger)

We use a static code analysis tool called Codacy in order to 
keep our code consistent and as simple as possible.
We use this in order to track the progress of our code quality
as the project progresses. This tool allows us to set goals
we can determine within our team and with our client to ensure code quality. Since people have different measures of quality,
we may dial it to our very own specificcations as to what quality means for us and our client. 
Some of the metrics we can fine tune are:

    - Code Complexity
    - File Structure Complexity
    - Duplication of Code and Files
    - Code Test Coverage
    - Pull Requests, Commits, etc.
    - Security Vulnerablity Analysis

Once we have set the standards we are to follow, the dashboard this tool provides will allow our client to visualize the quality of work we are completing with a letter grade rating.

Internally, we use this to track everyone's contribution and quality of work by viewing what issues are introduced by whom and how often. In this way, we are able to track bugs in our code to avoid future repetitions of the same mistakes,
and thus tune and refine our pipeline if needed.

To find out more about how Codacy works, please
visit the documentation page here: https://support.codacy.com/hc/en-us

## Travis CI
[![Build Status](https://travis-ci.org/Kien085/kiwi.svg?branch=master)](https://travis-ci.org/Kien085/kiwi)

We use Travis CI as our continuous integration tool. It allows us to centralize our builds and deployments. while adding another layer of quality checks through testing and deployment
in a controlled environment, independer of any one's developer's
local environment. Since we may control this independent environment the way we want, it allows us to have a separate
environment where we may run our build process and incrementally add new features to our project. Not only this,
we can control what gets into the build in an incremental manner. 
We perform a series of tests that make sure that what we develop will work in the proposed environment we agree
upon with our client. It also allows us to perform code reviews so we can add a human aspect to how our code should
be in terms of quality, structure, and readability. 
Lastly, we can automate many tasks that would otherwise require
much developer time, saving our client time and money.

# Testing

For testing, we are using Enzyme and Jest.

Specifically, we are using Enzyme to test that our
components render as they should. In other words,
we want to ensure that what we visualize with our client
shows up in the user interface. We also perform a variety
of other tests that which include that our components
behave as they should. 
For example, when we set a specific color for text, does the
text actually change color? Does it render to the correct color? Etc.

Furthermore, we use Jest because of their focus on snapshots for testing purposes. We use snapshots to stay consistent
with how we want our components to look. These snapshots allow us to optimize the underlying implementation of a component while testing that its appearance has not changed. Jest compares a previous "snapshot" of what our code rendered to
and tests that our update does not change the appearance of the component. In this way, we are able to separate implementation tests from the rendering tests.

We recognize that performing tests that do not need to be performed is redudant and not time efficient. So, we have
set up our pipeline so that tests only run when they should
and are responsive to the changes made in the code base.
In other words, we run tests according to the chain of
dependencies that the change will affect.

# GitHub File Structure

We have organized our repository to make it easy to navigate
by anyone who may want to look at our current work by using
familiar names that are easy to understand and remember.

We have also made our best effort to keep different technologies separate so that they may not interfere with eachother with being run.

The following file structure roughly represents how we have organized our repository:

    /Kiwi
    - this is the topmost directory of our project
    - here you will find configuration files to most of the
      tools we use throughout our repository including TravisCI
      Firebase, ESDocs, etc

    /_tests_
    - here you will find our React tests, which include our
      Enzyme and Jest tests

    /dev
    - folder containts components that are currently under
      development

    /dev/peter-test
    - this folder contains our use of different frameworks
      for the purpose of comparing and contrasting the strengths and weaknesses of each framework
    - Included frameworks: Angular, React, Vue, and 
      WebComponents

    /docs
    - this folder contains teh documentation to the components
      under development as well as components that have reached
      production
    - docs are able to be viewed via a browser
<<<<<<< HEAD
=======

# License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

>>>>>>> 64a27565fdf40d1a5f7387547d085678633750e3
