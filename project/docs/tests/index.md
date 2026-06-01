# E2E Testing Documentation (Maestro)

## Overview
The app uses end-to-end (E2E) tests powered by Maestro for validating real user flows in the React Native application.
All tests live inside the `__e2e__` directory.

The project follows a simple structure:
* Individual flows inside the `flows/` folder
* Full test journeys defined at the root level of `__e2e__`

## Project Structure

**e2e**/
flows/
test.yaml
full-journey.yaml


## Flows

Flows are reusable test steps that represent specific parts of the app.

They usually cover small, focused actions like:
* Onboarding
* Navigation
* Account actions

### Example

* onboarding-anonymous
  * Performs onboarding
  * Signs in anonymously
  * Grants access to the app

* delete-account
  * Navigates to settings
  * Deletes the user account

---

## Full Journeys

Full journeys are complete end-to-end tests.

They combine multiple flows to simulate real user behavior from start to finish.

### Example

* anonymous-lifecycle
  * Runs onboarding
  * Creates a user session
  * Deletes the account

---

## Example Usage

A full journey file composes flows like this:

* runFlow: flows/onboarding-anonymous.yaml
* runFlow: flows/delete-account.yaml

---

## Testing Strategy

* Keep flows small and reusable
* Use full journeys to validate complete user experiences
* Avoid duplicating logic across tests
* Prefer testIDs (`id`) over text for more stable tests
* Ensure tests are independent and repeatable

---

## 🚀 Notes

* Do not use `launchApp` inside flows that are meant to be reused after login/onboarding
* Only the entry flow (like onboarding) should initialize the app state
* Full journeys should control the full execution order of flows
