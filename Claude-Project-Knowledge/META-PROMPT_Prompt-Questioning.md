# Comprehensive Guide to Effective Prompting for Framer Code Overrides

## 1. Context and Objective Setting

- Provide an overview of your Framer project:
  - What is the general purpose of your project?
  - What components or functionalities already exist?
  - Is there a `sharedStore` or global state being used?

- Clearly define the specific objective of the new override:
  - What specific action or behavior are you trying to implement?
  - How does this relate to existing functionality?

## 2. Component and Data Management

- Identify the Framer components involved:
  - Which component(s) will the override apply to?
  - Are there other components that will interact with this override?

- Describe how state will be managed:
  - Do you need to create or modify local or global state?
  - How will this state be updated and shared between components?

## 3. Interaction and Performance Considerations

- Specify the interactions and events that will trigger actions:
  - What user events will activate the override (click, hover, etc.)?
  - Are there any animations or transitions that should occur?

- Mention any performance concerns:
  - Are there operations that might be costly and need optimization?
  - Are frequent re-renders expected to be an issue?

## 4. Responsive Design and Cross-Platform Compatibility

- Indicate considerations for different screen sizes or platforms:
  - Should the override behave differently on mobile vs desktop?
  - Are there specific breakpoints to consider?

## 5. Code Structure and Integration

- Provide information on how you want to structure the code:
  - Do you prefer multiple small overrides or one larger, complex override?
  - Are there any naming conventions or coding styles to follow?

- Mention any integrations or external dependencies:
  - Does the override need to interact with any external APIs or libraries?
  - Are there restrictions on the dependencies you can use?

## 6. Testing and Use Cases

- Describe how you plan to test the override and the main use cases:
  - What scenarios should work correctly?
  - Are there edge cases or exceptional situations to consider?

## 7. Proactive Questioning Strategies

When formulating or refining your prompt, consider these strategies:

- Question the specificity of solutions:
  - "Is it necessary for this functionality to be tightly coupled to a specific component?"

- Explore reusability:
  - "How could this functionality be useful in other contexts within the project?"

- Request additional context:
  - "Can you provide more information on how this functionality integrates with the rest of the project?"

- Challenge implicit assumptions:
  - "Are we assuming this behavior is only needed for this specific component?"

- Propose multiple approaches:
  - Offer at least two different approaches to solving the problem, including a modular solution.

## 8. Reflection and Improvement

After formulating your prompt:

- Evaluate its comprehensiveness:
  - Does it cover all aspects of the Framer override development process?
- Consider its clarity and specificity:
  - Is the prompt clear enough to generate a focused and relevant response?
- Assess its alignment with project goals:
  - Does the prompt guide towards a solution that fits with the overall project architecture and design?

By following this guide and employing these strategies, you can create more effective prompts for developing Framer code overrides, leading to more efficient and productive development processes.
