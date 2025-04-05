"use strict";
exports.id = 2;
exports.ids = [2];
exports.modules = {

/***/ 461:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FewShotChatMessagePromptTemplate: () => (/* binding */ FewShotChatMessagePromptTemplate),
/* harmony export */   FewShotPromptTemplate: () => (/* binding */ FewShotPromptTemplate)
/* harmony export */ });
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(459);
/* harmony import */ var _prompt_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(353);
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(462);




/**
 * Prompt template that contains few-shot examples.
 * @augments BasePromptTemplate
 * @augments FewShotPromptTemplateInput
 * @example
 * ```typescript
 * const examplePrompt = PromptTemplate.fromTemplate(
 *   "Input: {input}\nOutput: {output}",
 * );
 *
 * const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
 *   [
 *     { input: "happy", output: "sad" },
 *     { input: "tall", output: "short" },
 *     { input: "energetic", output: "lethargic" },
 *     { input: "sunny", output: "gloomy" },
 *     { input: "windy", output: "calm" },
 *   ],
 *   new OpenAIEmbeddings(),
 *   HNSWLib,
 *   { k: 1 },
 * );
 *
 * const dynamicPrompt = new FewShotPromptTemplate({
 *   exampleSelector,
 *   examplePrompt,
 *   prefix: "Give the antonym of every input",
 *   suffix: "Input: {adjective}\nOutput:",
 *   inputVariables: ["adjective"],
 * });
 *
 * // Format the dynamic prompt with the input 'rainy'
 * console.log(await dynamicPrompt.format({ adjective: "rainy" }));
 *
 * ```
 */
class FewShotPromptTemplate extends _string_js__WEBPACK_IMPORTED_MODULE_0__.BaseStringPromptTemplate {
    constructor(input) {
        super(input);
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "examples", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exampleSelector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "examplePrompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "suffix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "exampleSeparator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "\n\n"
        });
        Object.defineProperty(this, "prefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "templateFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.assign(this, input);
        if (this.examples !== undefined && this.exampleSelector !== undefined) {
            throw new Error("Only one of 'examples' and 'example_selector' should be provided");
        }
        if (this.examples === undefined && this.exampleSelector === undefined) {
            throw new Error("One of 'examples' and 'example_selector' should be provided");
        }
        if (this.validateTemplate) {
            let totalInputVariables = this.inputVariables;
            if (this.partialVariables) {
                totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
            }
            (0,_template_js__WEBPACK_IMPORTED_MODULE_1__.checkValidTemplate)(this.prefix + this.suffix, this.templateFormat, totalInputVariables);
        }
    }
    _getPromptType() {
        return "few_shot";
    }
    static lc_name() {
        return "FewShotPromptTemplate";
    }
    async getExamples(inputVariables) {
        if (this.examples !== undefined) {
            return this.examples;
        }
        if (this.exampleSelector !== undefined) {
            return this.exampleSelector.selectExamples(inputVariables);
        }
        throw new Error("One of 'examples' and 'example_selector' should be provided");
    }
    async partial(values) {
        const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
        const newPartialVariables = {
            ...(this.partialVariables ?? {}),
            ...values,
        };
        const promptDict = {
            ...this,
            inputVariables: newInputVariables,
            partialVariables: newPartialVariables,
        };
        return new FewShotPromptTemplate(promptDict);
    }
    /**
     * Formats the prompt with the given values.
     * @param values The values to format the prompt with.
     * @returns A promise that resolves to a string representing the formatted prompt.
     */
    async format(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        const examples = await this.getExamples(allValues);
        const exampleStrings = await Promise.all(examples.map((example) => this.examplePrompt.format(example)));
        const template = [this.prefix, ...exampleStrings, this.suffix].join(this.exampleSeparator);
        return (0,_template_js__WEBPACK_IMPORTED_MODULE_1__.renderTemplate)(template, this.templateFormat, allValues);
    }
    serialize() {
        if (this.exampleSelector || !this.examples) {
            throw new Error("Serializing an example selector is not currently supported");
        }
        if (this.outputParser !== undefined) {
            throw new Error("Serializing an output parser is not currently supported");
        }
        return {
            _type: this._getPromptType(),
            input_variables: this.inputVariables,
            example_prompt: this.examplePrompt.serialize(),
            example_separator: this.exampleSeparator,
            suffix: this.suffix,
            prefix: this.prefix,
            template_format: this.templateFormat,
            examples: this.examples,
        };
    }
    static async deserialize(data) {
        const { example_prompt } = data;
        if (!example_prompt) {
            throw new Error("Missing example prompt");
        }
        const examplePrompt = await _prompt_js__WEBPACK_IMPORTED_MODULE_2__.PromptTemplate.deserialize(example_prompt);
        let examples;
        if (Array.isArray(data.examples)) {
            examples = data.examples;
        }
        else {
            throw new Error("Invalid examples format. Only list or string are supported.");
        }
        return new FewShotPromptTemplate({
            inputVariables: data.input_variables,
            examplePrompt,
            examples,
            exampleSeparator: data.example_separator,
            prefix: data.prefix,
            suffix: data.suffix,
            templateFormat: data.template_format,
        });
    }
}
/**
 * Chat prompt template that contains few-shot examples.
 * @augments BasePromptTemplateInput
 * @augments FewShotChatMessagePromptTemplateInput
 */
class FewShotChatMessagePromptTemplate extends _chat_js__WEBPACK_IMPORTED_MODULE_3__.BaseChatPromptTemplate {
    _getPromptType() {
        return "few_shot_chat";
    }
    static lc_name() {
        return "FewShotChatMessagePromptTemplate";
    }
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "examples", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exampleSelector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "examplePrompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "suffix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "exampleSeparator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "\n\n"
        });
        Object.defineProperty(this, "prefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "templateFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.examples = fields.examples;
        this.examplePrompt = fields.examplePrompt;
        this.exampleSeparator = fields.exampleSeparator ?? "\n\n";
        this.exampleSelector = fields.exampleSelector;
        this.prefix = fields.prefix ?? "";
        this.suffix = fields.suffix ?? "";
        this.templateFormat = fields.templateFormat ?? "f-string";
        this.validateTemplate = fields.validateTemplate ?? true;
        if (this.examples !== undefined && this.exampleSelector !== undefined) {
            throw new Error("Only one of 'examples' and 'example_selector' should be provided");
        }
        if (this.examples === undefined && this.exampleSelector === undefined) {
            throw new Error("One of 'examples' and 'example_selector' should be provided");
        }
        if (this.validateTemplate) {
            let totalInputVariables = this.inputVariables;
            if (this.partialVariables) {
                totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
            }
            (0,_template_js__WEBPACK_IMPORTED_MODULE_1__.checkValidTemplate)(this.prefix + this.suffix, this.templateFormat, totalInputVariables);
        }
    }
    async getExamples(inputVariables) {
        if (this.examples !== undefined) {
            return this.examples;
        }
        if (this.exampleSelector !== undefined) {
            return this.exampleSelector.selectExamples(inputVariables);
        }
        throw new Error("One of 'examples' and 'example_selector' should be provided");
    }
    /**
     * Formats the list of values and returns a list of formatted messages.
     * @param values The values to format the prompt with.
     * @returns A promise that resolves to a string representing the formatted prompt.
     */
    async formatMessages(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        let examples = await this.getExamples(allValues);
        examples = examples.map((example) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = {};
            this.examplePrompt.inputVariables.forEach((inputVariable) => {
                result[inputVariable] = example[inputVariable];
            });
            return result;
        });
        const messages = [];
        for (const example of examples) {
            const exampleMessages = await this.examplePrompt.formatMessages(example);
            messages.push(...exampleMessages);
        }
        return messages;
    }
    /**
     * Formats the prompt with the given values.
     * @param values The values to format the prompt with.
     * @returns A promise that resolves to a string representing the formatted prompt.
     */
    async format(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        const examples = await this.getExamples(allValues);
        const exampleMessages = await Promise.all(examples.map((example) => this.examplePrompt.formatMessages(example)));
        const exampleStrings = exampleMessages
            .flat()
            .map((message) => message.content);
        const template = [this.prefix, ...exampleStrings, this.suffix].join(this.exampleSeparator);
        return (0,_template_js__WEBPACK_IMPORTED_MODULE_1__.renderTemplate)(template, this.templateFormat, allValues);
    }
    /**
     * Partially formats the prompt with the given values.
     * @param values The values to partially format the prompt with.
     * @returns A promise that resolves to an instance of `FewShotChatMessagePromptTemplate` with the given values partially formatted.
     */
    async partial(values) {
        const newInputVariables = this.inputVariables.filter((variable) => !(variable in values));
        const newPartialVariables = {
            ...(this.partialVariables ?? {}),
            ...values,
        };
        const promptDict = {
            ...this,
            inputVariables: newInputVariables,
            partialVariables: newPartialVariables,
        };
        return new FewShotChatMessagePromptTemplate(promptDict);
    }
}


/***/ }),

/***/ 462:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIMessagePromptTemplate: () => (/* binding */ AIMessagePromptTemplate),
/* harmony export */   BaseChatPromptTemplate: () => (/* binding */ BaseChatPromptTemplate),
/* harmony export */   BaseMessagePromptTemplate: () => (/* binding */ BaseMessagePromptTemplate),
/* harmony export */   BaseMessageStringPromptTemplate: () => (/* binding */ BaseMessageStringPromptTemplate),
/* harmony export */   ChatMessagePromptTemplate: () => (/* binding */ ChatMessagePromptTemplate),
/* harmony export */   ChatPromptTemplate: () => (/* binding */ ChatPromptTemplate),
/* harmony export */   HumanMessagePromptTemplate: () => (/* binding */ HumanMessagePromptTemplate),
/* harmony export */   MessagesPlaceholder: () => (/* binding */ MessagesPlaceholder),
/* harmony export */   SystemMessagePromptTemplate: () => (/* binding */ SystemMessagePromptTemplate)
/* harmony export */ });
/* harmony import */ var _messages_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(463);
/* harmony import */ var _prompt_values_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(355);
/* harmony import */ var _runnables_base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(370);
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(354);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(369);
/* harmony import */ var _prompt_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(353);
/* harmony import */ var _image_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(466);
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(459);
/* harmony import */ var _errors_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(361);
// Default generic "any" values are for backwards compatibility.
// Replace with "string" when we are comfortable with a breaking change.









/**
 * Abstract class that serves as a base for creating message prompt
 * templates. It defines how to format messages for different roles in a
 * conversation.
 */
class BaseMessagePromptTemplate extends _runnables_base_js__WEBPACK_IMPORTED_MODULE_2__.Runnable {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain_core", "prompts", "chat"]
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    /**
     * Calls the formatMessages method with the provided input and options.
     * @param input Input for the formatMessages method
     * @param options Optional BaseCallbackConfig
     * @returns Formatted output messages
     */
    async invoke(input, options) {
        return this._callWithConfig((input) => this.formatMessages(input), input, { ...options, runType: "prompt" });
    }
}
/**
 * Class that represents a placeholder for messages in a chat prompt. It
 * extends the BaseMessagePromptTemplate.
 */
class MessagesPlaceholder extends BaseMessagePromptTemplate {
    static lc_name() {
        return "MessagesPlaceholder";
    }
    constructor(fields) {
        if (typeof fields === "string") {
            // eslint-disable-next-line no-param-reassign
            fields = { variableName: fields };
        }
        super(fields);
        Object.defineProperty(this, "variableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "optional", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.variableName = fields.variableName;
        this.optional = fields.optional ?? false;
    }
    get inputVariables() {
        return [this.variableName];
    }
    async formatMessages(values) {
        const input = values[this.variableName];
        if (this.optional && !input) {
            return [];
        }
        else if (!input) {
            const error = new Error(`Field "${this.variableName}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages as an input value. Received: undefined`);
            error.name = "InputFormatError";
            throw error;
        }
        let formattedMessages;
        try {
            if (Array.isArray(input)) {
                formattedMessages = input.map(_messages_index_js__WEBPACK_IMPORTED_MODULE_0__.coerceMessageLikeToMessage);
            }
            else {
                formattedMessages = [(0,_messages_index_js__WEBPACK_IMPORTED_MODULE_0__.coerceMessageLikeToMessage)(input)];
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            const readableInput = typeof input === "string" ? input : JSON.stringify(input, null, 2);
            const error = new Error([
                `Field "${this.variableName}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages or coerceable values as input.`,
                `Received value: ${readableInput}`,
                `Additional message: ${e.message}`,
            ].join("\n\n"));
            error.name = "InputFormatError";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error.lc_error_code = e.lc_error_code;
            throw error;
        }
        return formattedMessages;
    }
}
/**
 * Abstract class that serves as a base for creating message string prompt
 * templates. It extends the BaseMessagePromptTemplate.
 */
class BaseMessageStringPromptTemplate extends BaseMessagePromptTemplate {
    constructor(fields) {
        if (!("prompt" in fields)) {
            // eslint-disable-next-line no-param-reassign
            fields = { prompt: fields };
        }
        super(fields);
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.prompt = fields.prompt;
    }
    get inputVariables() {
        return this.prompt.inputVariables;
    }
    async formatMessages(values) {
        return [await this.format(values)];
    }
}
/**
 * Abstract class that serves as a base for creating chat prompt
 * templates. It extends the BasePromptTemplate.
 */
class BaseChatPromptTemplate extends _base_js__WEBPACK_IMPORTED_MODULE_4__.BasePromptTemplate {
    constructor(input) {
        super(input);
    }
    async format(values) {
        return (await this.formatPromptValue(values)).toString();
    }
    async formatPromptValue(values) {
        const resultMessages = await this.formatMessages(values);
        return new _prompt_values_js__WEBPACK_IMPORTED_MODULE_1__.ChatPromptValue(resultMessages);
    }
}
/**
 * Class that represents a chat message prompt template. It extends the
 * BaseMessageStringPromptTemplate.
 */
class ChatMessagePromptTemplate extends BaseMessageStringPromptTemplate {
    static lc_name() {
        return "ChatMessagePromptTemplate";
    }
    constructor(fields, role) {
        if (!("prompt" in fields)) {
            // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-non-null-assertion
            fields = { prompt: fields, role: role };
        }
        super(fields);
        Object.defineProperty(this, "role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.role = fields.role;
    }
    async format(values) {
        return new _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.ChatMessage(await this.prompt.format(values), this.role);
    }
    static fromTemplate(template, role, options) {
        return new this(_prompt_js__WEBPACK_IMPORTED_MODULE_5__.PromptTemplate.fromTemplate(template, {
            templateFormat: options?.templateFormat,
        }), role);
    }
}
class _StringImageMessagePromptTemplate extends BaseMessagePromptTemplate {
    static _messageClass() {
        throw new Error("Can not invoke _messageClass from inside _StringImageMessagePromptTemplate");
    }
    constructor(
    /** @TODO When we come up with a better way to type prompt templates, fix this */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields, additionalOptions) {
        if (!("prompt" in fields)) {
            // eslint-disable-next-line no-param-reassign
            fields = { prompt: fields };
        }
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain_core", "prompts", "chat"]
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "inputVariables", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "additionalOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "messageClass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // ChatMessage contains role field, others don't.
        // Because of this, we have a separate class property for ChatMessage.
        Object.defineProperty(this, "chatMessageClass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.prompt = fields.prompt;
        if (Array.isArray(this.prompt)) {
            let inputVariables = [];
            this.prompt.forEach((prompt) => {
                if ("inputVariables" in prompt) {
                    inputVariables = inputVariables.concat(prompt.inputVariables);
                }
            });
            this.inputVariables = inputVariables;
        }
        else {
            this.inputVariables = this.prompt.inputVariables;
        }
        this.additionalOptions = additionalOptions ?? this.additionalOptions;
    }
    createMessage(content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constructor = this.constructor;
        if (constructor._messageClass()) {
            const MsgClass = constructor._messageClass();
            return new MsgClass({ content });
        }
        else if (constructor.chatMessageClass) {
            const MsgClass = constructor.chatMessageClass();
            // Assuming ChatMessage constructor also takes a content argument
            return new MsgClass({
                content,
                role: this.getRoleFromMessageClass(MsgClass.lc_name()),
            });
        }
        else {
            throw new Error("No message class defined");
        }
    }
    getRoleFromMessageClass(name) {
        switch (name) {
            case "HumanMessage":
                return "human";
            case "AIMessage":
                return "ai";
            case "SystemMessage":
                return "system";
            case "ChatMessage":
                return "chat";
            default:
                throw new Error("Invalid message class name");
        }
    }
    static fromTemplate(template, additionalOptions) {
        if (typeof template === "string") {
            return new this(_prompt_js__WEBPACK_IMPORTED_MODULE_5__.PromptTemplate.fromTemplate(template, additionalOptions));
        }
        const prompt = [];
        for (const item of template) {
            if (typeof item === "string" ||
                (typeof item === "object" && "text" in item)) {
                let text = "";
                if (typeof item === "string") {
                    text = item;
                }
                else if (typeof item.text === "string") {
                    text = item.text ?? "";
                }
                const options = {
                    ...additionalOptions,
                    ...(typeof item !== "string"
                        ? { additionalContentFields: item }
                        : {}),
                };
                prompt.push(_prompt_js__WEBPACK_IMPORTED_MODULE_5__.PromptTemplate.fromTemplate(text, options));
            }
            else if (typeof item === "object" && "image_url" in item) {
                let imgTemplate = item.image_url ?? "";
                let imgTemplateObject;
                let inputVariables = [];
                if (typeof imgTemplate === "string") {
                    let parsedTemplate;
                    if (additionalOptions?.templateFormat === "mustache") {
                        parsedTemplate = (0,_template_js__WEBPACK_IMPORTED_MODULE_7__.parseMustache)(imgTemplate);
                    }
                    else {
                        parsedTemplate = (0,_template_js__WEBPACK_IMPORTED_MODULE_7__.parseFString)(imgTemplate);
                    }
                    const variables = parsedTemplate.flatMap((item) => item.type === "variable" ? [item.name] : []);
                    if ((variables?.length ?? 0) > 0) {
                        if (variables.length > 1) {
                            throw new Error(`Only one format variable allowed per image template.\nGot: ${variables}\nFrom: ${imgTemplate}`);
                        }
                        inputVariables = [variables[0]];
                    }
                    else {
                        inputVariables = [];
                    }
                    imgTemplate = { url: imgTemplate };
                    imgTemplateObject = new _image_js__WEBPACK_IMPORTED_MODULE_6__.ImagePromptTemplate({
                        template: imgTemplate,
                        inputVariables,
                        templateFormat: additionalOptions?.templateFormat,
                        additionalContentFields: item,
                    });
                }
                else if (typeof imgTemplate === "object") {
                    if ("url" in imgTemplate) {
                        let parsedTemplate;
                        if (additionalOptions?.templateFormat === "mustache") {
                            parsedTemplate = (0,_template_js__WEBPACK_IMPORTED_MODULE_7__.parseMustache)(imgTemplate.url);
                        }
                        else {
                            parsedTemplate = (0,_template_js__WEBPACK_IMPORTED_MODULE_7__.parseFString)(imgTemplate.url);
                        }
                        inputVariables = parsedTemplate.flatMap((item) => item.type === "variable" ? [item.name] : []);
                    }
                    else {
                        inputVariables = [];
                    }
                    imgTemplateObject = new _image_js__WEBPACK_IMPORTED_MODULE_6__.ImagePromptTemplate({
                        template: imgTemplate,
                        inputVariables,
                        templateFormat: additionalOptions?.templateFormat,
                        additionalContentFields: item,
                    });
                }
                else {
                    throw new Error("Invalid image template");
                }
                prompt.push(imgTemplateObject);
            }
        }
        return new this({ prompt, additionalOptions });
    }
    async format(input) {
        // eslint-disable-next-line no-instanceof/no-instanceof
        if (this.prompt instanceof _string_js__WEBPACK_IMPORTED_MODULE_3__.BaseStringPromptTemplate) {
            const text = await this.prompt.format(input);
            return this.createMessage(text);
        }
        else {
            const content = [];
            for (const prompt of this.prompt) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let inputs = {};
                if (!("inputVariables" in prompt)) {
                    throw new Error(`Prompt ${prompt} does not have inputVariables defined.`);
                }
                for (const item of prompt.inputVariables) {
                    if (!inputs) {
                        inputs = { [item]: input[item] };
                    }
                    inputs = { ...inputs, [item]: input[item] };
                }
                // eslint-disable-next-line no-instanceof/no-instanceof
                if (prompt instanceof _string_js__WEBPACK_IMPORTED_MODULE_3__.BaseStringPromptTemplate) {
                    const formatted = await prompt.format(inputs);
                    let additionalContentFields;
                    if ("additionalContentFields" in prompt) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        additionalContentFields = prompt.additionalContentFields;
                    }
                    content.push({
                        ...additionalContentFields,
                        type: "text",
                        text: formatted,
                    });
                    /** @TODO replace this */
                    // eslint-disable-next-line no-instanceof/no-instanceof
                }
                else if (prompt instanceof _image_js__WEBPACK_IMPORTED_MODULE_6__.ImagePromptTemplate) {
                    const formatted = await prompt.format(inputs);
                    let additionalContentFields;
                    if ("additionalContentFields" in prompt) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        additionalContentFields = prompt.additionalContentFields;
                    }
                    content.push({
                        ...additionalContentFields,
                        type: "image_url",
                        image_url: formatted,
                    });
                }
            }
            return this.createMessage(content);
        }
    }
    async formatMessages(values) {
        return [await this.format(values)];
    }
}
/**
 * Class that represents a human message prompt template. It extends the
 * BaseMessageStringPromptTemplate.
 * @example
 * ```typescript
 * const message = HumanMessagePromptTemplate.fromTemplate("{text}");
 * const formatted = await message.format({ text: "Hello world!" });
 *
 * const chatPrompt = ChatPromptTemplate.fromMessages([message]);
 * const formattedChatPrompt = await chatPrompt.invoke({
 *   text: "Hello world!",
 * });
 * ```
 */
class HumanMessagePromptTemplate extends _StringImageMessagePromptTemplate {
    static _messageClass() {
        return _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.HumanMessage;
    }
    static lc_name() {
        return "HumanMessagePromptTemplate";
    }
}
/**
 * Class that represents an AI message prompt template. It extends the
 * BaseMessageStringPromptTemplate.
 */
class AIMessagePromptTemplate extends _StringImageMessagePromptTemplate {
    static _messageClass() {
        return _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.AIMessage;
    }
    static lc_name() {
        return "AIMessagePromptTemplate";
    }
}
/**
 * Class that represents a system message prompt template. It extends the
 * BaseMessageStringPromptTemplate.
 * @example
 * ```typescript
 * const message = SystemMessagePromptTemplate.fromTemplate("{text}");
 * const formatted = await message.format({ text: "Hello world!" });
 *
 * const chatPrompt = ChatPromptTemplate.fromMessages([message]);
 * const formattedChatPrompt = await chatPrompt.invoke({
 *   text: "Hello world!",
 * });
 * ```
 */
class SystemMessagePromptTemplate extends _StringImageMessagePromptTemplate {
    static _messageClass() {
        return _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.SystemMessage;
    }
    static lc_name() {
        return "SystemMessagePromptTemplate";
    }
}
function _isBaseMessagePromptTemplate(baseMessagePromptTemplateLike) {
    return (typeof baseMessagePromptTemplateLike
        .formatMessages === "function");
}
function _coerceMessagePromptTemplateLike(messagePromptTemplateLike, extra) {
    if (_isBaseMessagePromptTemplate(messagePromptTemplateLike) ||
        (0,_messages_index_js__WEBPACK_IMPORTED_MODULE_0__.isBaseMessage)(messagePromptTemplateLike)) {
        return messagePromptTemplateLike;
    }
    if (Array.isArray(messagePromptTemplateLike) &&
        messagePromptTemplateLike[0] === "placeholder") {
        const messageContent = messagePromptTemplateLike[1];
        if (extra?.templateFormat === "mustache" &&
            typeof messageContent === "string" &&
            messageContent.slice(0, 2) === "{{" &&
            messageContent.slice(-2) === "}}") {
            const variableName = messageContent.slice(2, -2);
            return new MessagesPlaceholder({ variableName, optional: true });
        }
        else if (typeof messageContent === "string" &&
            messageContent[0] === "{" &&
            messageContent[messageContent.length - 1] === "}") {
            const variableName = messageContent.slice(1, -1);
            return new MessagesPlaceholder({ variableName, optional: true });
        }
        throw new Error(`Invalid placeholder template for format ${extra?.templateFormat ?? `"f-string"`}: "${messagePromptTemplateLike[1]}". Expected a variable name surrounded by ${extra?.templateFormat === "mustache" ? "double" : "single"} curly braces.`);
    }
    const message = (0,_messages_index_js__WEBPACK_IMPORTED_MODULE_0__.coerceMessageLikeToMessage)(messagePromptTemplateLike);
    let templateData;
    if (typeof message.content === "string") {
        templateData = message.content;
    }
    else {
        // Assuming message.content is an array of complex objects, transform it.
        templateData = message.content.map((item) => {
            if ("text" in item) {
                return { ...item, text: item.text };
            }
            else if ("image_url" in item) {
                return { ...item, image_url: item.image_url };
            }
            else {
                return item;
            }
        });
    }
    if (message._getType() === "human") {
        return HumanMessagePromptTemplate.fromTemplate(templateData, extra);
    }
    else if (message._getType() === "ai") {
        return AIMessagePromptTemplate.fromTemplate(templateData, extra);
    }
    else if (message._getType() === "system") {
        return SystemMessagePromptTemplate.fromTemplate(templateData, extra);
    }
    else if (_messages_index_js__WEBPACK_IMPORTED_MODULE_0__.ChatMessage.isInstance(message)) {
        return ChatMessagePromptTemplate.fromTemplate(message.content, message.role, extra);
    }
    else {
        throw new Error(`Could not coerce message prompt template from input. Received message type: "${message._getType()}".`);
    }
}
function isMessagesPlaceholder(x) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return x.constructor.lc_name() === "MessagesPlaceholder";
}
/**
 * Class that represents a chat prompt. It extends the
 * BaseChatPromptTemplate and uses an array of BaseMessagePromptTemplate
 * instances to format a series of messages for a conversation.
 * @example
 * ```typescript
 * const message = SystemMessagePromptTemplate.fromTemplate("{text}");
 * const chatPrompt = ChatPromptTemplate.fromMessages([
 *   ["ai", "You are a helpful assistant."],
 *   message,
 * ]);
 * const formattedChatPrompt = await chatPrompt.invoke({
 *   text: "Hello world!",
 * });
 * ```
 */
class ChatPromptTemplate extends BaseChatPromptTemplate {
    static lc_name() {
        return "ChatPromptTemplate";
    }
    get lc_aliases() {
        return {
            promptMessages: "messages",
        };
    }
    constructor(input) {
        super(input);
        Object.defineProperty(this, "promptMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "validateTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "templateFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "f-string"
        });
        // If input is mustache and validateTemplate is not defined, set it to false
        if (input.templateFormat === "mustache" &&
            input.validateTemplate === undefined) {
            this.validateTemplate = false;
        }
        Object.assign(this, input);
        if (this.validateTemplate) {
            const inputVariablesMessages = new Set();
            for (const promptMessage of this.promptMessages) {
                // eslint-disable-next-line no-instanceof/no-instanceof
                if (promptMessage instanceof _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.BaseMessage)
                    continue;
                for (const inputVariable of promptMessage.inputVariables) {
                    inputVariablesMessages.add(inputVariable);
                }
            }
            const totalInputVariables = this.inputVariables;
            const inputVariablesInstance = new Set(this.partialVariables
                ? totalInputVariables.concat(Object.keys(this.partialVariables))
                : totalInputVariables);
            const difference = new Set([...inputVariablesInstance].filter((x) => !inputVariablesMessages.has(x)));
            if (difference.size > 0) {
                throw new Error(`Input variables \`${[
                    ...difference,
                ]}\` are not used in any of the prompt messages.`);
            }
            const otherDifference = new Set([...inputVariablesMessages].filter((x) => !inputVariablesInstance.has(x)));
            if (otherDifference.size > 0) {
                throw new Error(`Input variables \`${[
                    ...otherDifference,
                ]}\` are used in prompt messages but not in the prompt template.`);
            }
        }
    }
    _getPromptType() {
        return "chat";
    }
    async _parseImagePrompts(message, inputValues) {
        if (typeof message.content === "string") {
            return message;
        }
        const formattedMessageContent = await Promise.all(message.content.map(async (item) => {
            if (item.type !== "image_url") {
                return item;
            }
            let imageUrl = "";
            if (typeof item.image_url === "string") {
                imageUrl = item.image_url;
            }
            else {
                imageUrl = item.image_url.url;
            }
            const promptTemplatePlaceholder = _prompt_js__WEBPACK_IMPORTED_MODULE_5__.PromptTemplate.fromTemplate(imageUrl, {
                templateFormat: this.templateFormat,
            });
            const formattedUrl = await promptTemplatePlaceholder.format(inputValues);
            if (typeof item.image_url !== "string" && "url" in item.image_url) {
                // eslint-disable-next-line no-param-reassign
                item.image_url.url = formattedUrl;
            }
            else {
                // eslint-disable-next-line no-param-reassign
                item.image_url = formattedUrl;
            }
            return item;
        }));
        // eslint-disable-next-line no-param-reassign
        message.content = formattedMessageContent;
        return message;
    }
    async formatMessages(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        let resultMessages = [];
        for (const promptMessage of this.promptMessages) {
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (promptMessage instanceof _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.BaseMessage) {
                resultMessages.push(await this._parseImagePrompts(promptMessage, allValues));
            }
            else {
                const inputValues = promptMessage.inputVariables.reduce((acc, inputVariable) => {
                    if (!(inputVariable in allValues) &&
                        !(isMessagesPlaceholder(promptMessage) && promptMessage.optional)) {
                        const error = (0,_errors_index_js__WEBPACK_IMPORTED_MODULE_8__.addLangChainErrorFields)(new Error(`Missing value for input variable \`${inputVariable.toString()}\``), "INVALID_PROMPT_INPUT");
                        throw error;
                    }
                    acc[inputVariable] = allValues[inputVariable];
                    return acc;
                }, {});
                const message = await promptMessage.formatMessages(inputValues);
                resultMessages = resultMessages.concat(message);
            }
        }
        return resultMessages;
    }
    async partial(values) {
        // This is implemented in a way it doesn't require making
        // BaseMessagePromptTemplate aware of .partial()
        const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
        const newPartialVariables = {
            ...(this.partialVariables ?? {}),
            ...values,
        };
        const promptDict = {
            ...this,
            inputVariables: newInputVariables,
            partialVariables: newPartialVariables,
        };
        return new ChatPromptTemplate(promptDict);
    }
    static fromTemplate(template, options) {
        const prompt = _prompt_js__WEBPACK_IMPORTED_MODULE_5__.PromptTemplate.fromTemplate(template, options);
        const humanTemplate = new HumanMessagePromptTemplate({ prompt });
        return this.fromMessages([humanTemplate]);
    }
    /**
     * Create a chat model-specific prompt from individual chat messages
     * or message-like tuples.
     * @param promptMessages Messages to be passed to the chat model
     * @returns A new ChatPromptTemplate
     */
    static fromMessages(promptMessages, extra) {
        const flattenedMessages = promptMessages.reduce((acc, promptMessage) => acc.concat(
        // eslint-disable-next-line no-instanceof/no-instanceof
        promptMessage instanceof ChatPromptTemplate
            ? promptMessage.promptMessages
            : [
                _coerceMessagePromptTemplateLike(promptMessage, extra),
            ]), []);
        const flattenedPartialVariables = promptMessages.reduce((acc, promptMessage) => 
        // eslint-disable-next-line no-instanceof/no-instanceof
        promptMessage instanceof ChatPromptTemplate
            ? Object.assign(acc, promptMessage.partialVariables)
            : acc, Object.create(null));
        const inputVariables = new Set();
        for (const promptMessage of flattenedMessages) {
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (promptMessage instanceof _messages_index_js__WEBPACK_IMPORTED_MODULE_0__.BaseMessage)
                continue;
            for (const inputVariable of promptMessage.inputVariables) {
                if (inputVariable in flattenedPartialVariables) {
                    continue;
                }
                inputVariables.add(inputVariable);
            }
        }
        return new this({
            ...extra,
            inputVariables: [...inputVariables],
            promptMessages: flattenedMessages,
            partialVariables: flattenedPartialVariables,
            templateFormat: extra?.templateFormat,
        });
    }
    /** @deprecated Renamed to .fromMessages */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromPromptMessages(promptMessages) {
        return this.fromMessages(promptMessages);
    }
}


/***/ }),

/***/ 463:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIMessage: () => (/* reexport safe */ _ai_js__WEBPACK_IMPORTED_MODULE_0__.AIMessage),
/* harmony export */   AIMessageChunk: () => (/* reexport safe */ _ai_js__WEBPACK_IMPORTED_MODULE_0__.AIMessageChunk),
/* harmony export */   BaseMessage: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__.BaseMessage),
/* harmony export */   BaseMessageChunk: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__.BaseMessageChunk),
/* harmony export */   ChatMessage: () => (/* reexport safe */ _chat_js__WEBPACK_IMPORTED_MODULE_2__.ChatMessage),
/* harmony export */   ChatMessageChunk: () => (/* reexport safe */ _chat_js__WEBPACK_IMPORTED_MODULE_2__.ChatMessageChunk),
/* harmony export */   FunctionMessage: () => (/* reexport safe */ _function_js__WEBPACK_IMPORTED_MODULE_3__.FunctionMessage),
/* harmony export */   FunctionMessageChunk: () => (/* reexport safe */ _function_js__WEBPACK_IMPORTED_MODULE_3__.FunctionMessageChunk),
/* harmony export */   HumanMessage: () => (/* reexport safe */ _human_js__WEBPACK_IMPORTED_MODULE_4__.HumanMessage),
/* harmony export */   HumanMessageChunk: () => (/* reexport safe */ _human_js__WEBPACK_IMPORTED_MODULE_4__.HumanMessageChunk),
/* harmony export */   RemoveMessage: () => (/* reexport safe */ _modifier_js__WEBPACK_IMPORTED_MODULE_8__.RemoveMessage),
/* harmony export */   SystemMessage: () => (/* reexport safe */ _system_js__WEBPACK_IMPORTED_MODULE_5__.SystemMessage),
/* harmony export */   SystemMessageChunk: () => (/* reexport safe */ _system_js__WEBPACK_IMPORTED_MODULE_5__.SystemMessageChunk),
/* harmony export */   ToolMessage: () => (/* reexport safe */ _tool_js__WEBPACK_IMPORTED_MODULE_9__.ToolMessage),
/* harmony export */   ToolMessageChunk: () => (/* reexport safe */ _tool_js__WEBPACK_IMPORTED_MODULE_9__.ToolMessageChunk),
/* harmony export */   _isMessageFieldWithRole: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__._isMessageFieldWithRole),
/* harmony export */   _mergeDicts: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__._mergeDicts),
/* harmony export */   _mergeLists: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__._mergeLists),
/* harmony export */   _mergeObj: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__._mergeObj),
/* harmony export */   _mergeStatus: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__._mergeStatus),
/* harmony export */   coerceMessageLikeToMessage: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.coerceMessageLikeToMessage),
/* harmony export */   convertToChunk: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.convertToChunk),
/* harmony export */   defaultTextSplitter: () => (/* reexport safe */ _transformers_js__WEBPACK_IMPORTED_MODULE_7__.defaultTextSplitter),
/* harmony export */   filterMessages: () => (/* reexport safe */ _transformers_js__WEBPACK_IMPORTED_MODULE_7__.filterMessages),
/* harmony export */   getBufferString: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.getBufferString),
/* harmony export */   isAIMessage: () => (/* reexport safe */ _ai_js__WEBPACK_IMPORTED_MODULE_0__.isAIMessage),
/* harmony export */   isAIMessageChunk: () => (/* reexport safe */ _ai_js__WEBPACK_IMPORTED_MODULE_0__.isAIMessageChunk),
/* harmony export */   isBaseMessage: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__.isBaseMessage),
/* harmony export */   isBaseMessageChunk: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__.isBaseMessageChunk),
/* harmony export */   isChatMessage: () => (/* reexport safe */ _chat_js__WEBPACK_IMPORTED_MODULE_2__.isChatMessage),
/* harmony export */   isChatMessageChunk: () => (/* reexport safe */ _chat_js__WEBPACK_IMPORTED_MODULE_2__.isChatMessageChunk),
/* harmony export */   isFunctionMessage: () => (/* reexport safe */ _function_js__WEBPACK_IMPORTED_MODULE_3__.isFunctionMessage),
/* harmony export */   isFunctionMessageChunk: () => (/* reexport safe */ _function_js__WEBPACK_IMPORTED_MODULE_3__.isFunctionMessageChunk),
/* harmony export */   isHumanMessage: () => (/* reexport safe */ _human_js__WEBPACK_IMPORTED_MODULE_4__.isHumanMessage),
/* harmony export */   isHumanMessageChunk: () => (/* reexport safe */ _human_js__WEBPACK_IMPORTED_MODULE_4__.isHumanMessageChunk),
/* harmony export */   isOpenAIToolCallArray: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__.isOpenAIToolCallArray),
/* harmony export */   isSystemMessage: () => (/* reexport safe */ _system_js__WEBPACK_IMPORTED_MODULE_5__.isSystemMessage),
/* harmony export */   isSystemMessageChunk: () => (/* reexport safe */ _system_js__WEBPACK_IMPORTED_MODULE_5__.isSystemMessageChunk),
/* harmony export */   isToolMessage: () => (/* reexport safe */ _tool_js__WEBPACK_IMPORTED_MODULE_9__.isToolMessage),
/* harmony export */   isToolMessageChunk: () => (/* reexport safe */ _tool_js__WEBPACK_IMPORTED_MODULE_9__.isToolMessageChunk),
/* harmony export */   mapChatMessagesToStoredMessages: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.mapChatMessagesToStoredMessages),
/* harmony export */   mapStoredMessageToChatMessage: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.mapStoredMessageToChatMessage),
/* harmony export */   mapStoredMessagesToChatMessages: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.mapStoredMessagesToChatMessages),
/* harmony export */   mergeContent: () => (/* reexport safe */ _base_js__WEBPACK_IMPORTED_MODULE_1__.mergeContent),
/* harmony export */   mergeMessageRuns: () => (/* reexport safe */ _transformers_js__WEBPACK_IMPORTED_MODULE_7__.mergeMessageRuns),
/* harmony export */   trimMessages: () => (/* reexport safe */ _transformers_js__WEBPACK_IMPORTED_MODULE_7__.trimMessages)
/* harmony export */ });
/* harmony import */ var _ai_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(363);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(359);
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(366);
/* harmony import */ var _function_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(367);
/* harmony import */ var _human_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(358);
/* harmony import */ var _system_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(368);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(360);
/* harmony import */ var _transformers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(464);
/* harmony import */ var _modifier_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(465);
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(365);









// TODO: Use a star export when we deprecate the
// existing "ToolCall" type in "base.js".



/***/ }),

/***/ 464:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultTextSplitter: () => (/* binding */ defaultTextSplitter),
/* harmony export */   filterMessages: () => (/* binding */ filterMessages),
/* harmony export */   mergeMessageRuns: () => (/* binding */ mergeMessageRuns),
/* harmony export */   trimMessages: () => (/* binding */ trimMessages)
/* harmony export */ });
/* harmony import */ var _runnables_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(370);
/* harmony import */ var _ai_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(363);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(359);
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(366);
/* harmony import */ var _function_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(367);
/* harmony import */ var _human_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(358);
/* harmony import */ var _modifier_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(465);
/* harmony import */ var _system_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(368);
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(365);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(360);










const _isMessageType = (msg, types) => {
    const typesAsStrings = [
        ...new Set(types?.map((t) => {
            if (typeof t === "string") {
                return t;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const instantiatedMsgClass = new t({});
            if (!("getType" in instantiatedMsgClass) ||
                typeof instantiatedMsgClass.getType !== "function") {
                throw new Error("Invalid type provided.");
            }
            return instantiatedMsgClass.getType();
        })),
    ];
    const msgType = msg.getType();
    return typesAsStrings.some((t) => t === msgType);
};
function filterMessages(messagesOrOptions, options) {
    if (Array.isArray(messagesOrOptions)) {
        return _filterMessages(messagesOrOptions, options);
    }
    return _runnables_base_js__WEBPACK_IMPORTED_MODULE_0__.RunnableLambda.from((input) => {
        return _filterMessages(input, messagesOrOptions);
    });
}
function _filterMessages(messages, options = {}) {
    const { includeNames, excludeNames, includeTypes, excludeTypes, includeIds, excludeIds, } = options;
    const filtered = [];
    for (const msg of messages) {
        if (excludeNames && msg.name && excludeNames.includes(msg.name)) {
            continue;
        }
        else if (excludeTypes && _isMessageType(msg, excludeTypes)) {
            continue;
        }
        else if (excludeIds && msg.id && excludeIds.includes(msg.id)) {
            continue;
        }
        // default to inclusion when no inclusion criteria given.
        if (!(includeTypes || includeIds || includeNames)) {
            filtered.push(msg);
        }
        else if (includeNames &&
            msg.name &&
            includeNames.some((iName) => iName === msg.name)) {
            filtered.push(msg);
        }
        else if (includeTypes && _isMessageType(msg, includeTypes)) {
            filtered.push(msg);
        }
        else if (includeIds && msg.id && includeIds.some((id) => id === msg.id)) {
            filtered.push(msg);
        }
    }
    return filtered;
}
function mergeMessageRuns(messages) {
    if (Array.isArray(messages)) {
        return _mergeMessageRuns(messages);
    }
    return _runnables_base_js__WEBPACK_IMPORTED_MODULE_0__.RunnableLambda.from(_mergeMessageRuns);
}
function _mergeMessageRuns(messages) {
    if (!messages.length) {
        return [];
    }
    const merged = [];
    for (const msg of messages) {
        const curr = msg;
        const last = merged.pop();
        if (!last) {
            merged.push(curr);
        }
        else if (curr.getType() === "tool" ||
            !(curr.getType() === last.getType())) {
            merged.push(last, curr);
        }
        else {
            const lastChunk = (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.convertToChunk)(last);
            const currChunk = (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.convertToChunk)(curr);
            const mergedChunks = lastChunk.concat(currChunk);
            if (typeof lastChunk.content === "string" &&
                typeof currChunk.content === "string") {
                mergedChunks.content = `${lastChunk.content}\n${currChunk.content}`;
            }
            merged.push(_chunkToMsg(mergedChunks));
        }
    }
    return merged;
}
function trimMessages(messagesOrOptions, options) {
    if (Array.isArray(messagesOrOptions)) {
        const messages = messagesOrOptions;
        if (!options) {
            throw new Error("Options parameter is required when providing messages.");
        }
        return _trimMessagesHelper(messages, options);
    }
    else {
        const trimmerOptions = messagesOrOptions;
        return _runnables_base_js__WEBPACK_IMPORTED_MODULE_0__.RunnableLambda.from((input) => _trimMessagesHelper(input, trimmerOptions)).withConfig({
            runName: "trim_messages",
        });
    }
}
async function _trimMessagesHelper(messages, options) {
    const { maxTokens, tokenCounter, strategy = "last", allowPartial = false, endOn, startOn, includeSystem = false, textSplitter, } = options;
    if (startOn && strategy === "first") {
        throw new Error("`startOn` should only be specified if `strategy` is 'last'.");
    }
    if (includeSystem && strategy === "first") {
        throw new Error("`includeSystem` should only be specified if `strategy` is 'last'.");
    }
    let listTokenCounter;
    if ("getNumTokens" in tokenCounter) {
        listTokenCounter = async (msgs) => {
            const tokenCounts = await Promise.all(msgs.map((msg) => tokenCounter.getNumTokens(msg.content)));
            return tokenCounts.reduce((sum, count) => sum + count, 0);
        };
    }
    else {
        listTokenCounter = async (msgs) => tokenCounter(msgs);
    }
    let textSplitterFunc = defaultTextSplitter;
    if (textSplitter) {
        if ("splitText" in textSplitter) {
            textSplitterFunc = textSplitter.splitText;
        }
        else {
            textSplitterFunc = async (text) => textSplitter(text);
        }
    }
    if (strategy === "first") {
        return _firstMaxTokens(messages, {
            maxTokens,
            tokenCounter: listTokenCounter,
            textSplitter: textSplitterFunc,
            partialStrategy: allowPartial ? "first" : undefined,
            endOn,
        });
    }
    else if (strategy === "last") {
        return _lastMaxTokens(messages, {
            maxTokens,
            tokenCounter: listTokenCounter,
            textSplitter: textSplitterFunc,
            allowPartial,
            includeSystem,
            startOn,
            endOn,
        });
    }
    else {
        throw new Error(`Unrecognized strategy: '${strategy}'. Must be one of 'first' or 'last'.`);
    }
}
async function _firstMaxTokens(messages, options) {
    const { maxTokens, tokenCounter, textSplitter, partialStrategy, endOn } = options;
    let messagesCopy = [...messages];
    let idx = 0;
    for (let i = 0; i < messagesCopy.length; i += 1) {
        const remainingMessages = i > 0 ? messagesCopy.slice(0, -i) : messagesCopy;
        if ((await tokenCounter(remainingMessages)) <= maxTokens) {
            idx = messagesCopy.length - i;
            break;
        }
    }
    if (idx < messagesCopy.length - 1 && partialStrategy) {
        let includedPartial = false;
        if (Array.isArray(messagesCopy[idx].content)) {
            const excluded = messagesCopy[idx];
            if (typeof excluded.content === "string") {
                throw new Error("Expected content to be an array.");
            }
            const numBlock = excluded.content.length;
            const reversedContent = partialStrategy === "last"
                ? [...excluded.content].reverse()
                : excluded.content;
            for (let i = 1; i <= numBlock; i += 1) {
                const partialContent = partialStrategy === "first"
                    ? reversedContent.slice(0, i)
                    : reversedContent.slice(-i);
                const fields = Object.fromEntries(Object.entries(excluded).filter(([k]) => k !== "type" && !k.startsWith("lc_")));
                const updatedMessage = _switchTypeToMessage(excluded.getType(), {
                    ...fields,
                    content: partialContent,
                });
                const slicedMessages = [...messagesCopy.slice(0, idx), updatedMessage];
                if ((await tokenCounter(slicedMessages)) <= maxTokens) {
                    messagesCopy = slicedMessages;
                    idx += 1;
                    includedPartial = true;
                }
                else {
                    break;
                }
            }
            if (includedPartial && partialStrategy === "last") {
                excluded.content = [...reversedContent].reverse();
            }
        }
        if (!includedPartial) {
            const excluded = messagesCopy[idx];
            let text;
            if (Array.isArray(excluded.content) &&
                excluded.content.some((block) => typeof block === "string" || block.type === "text")) {
                const textBlock = excluded.content.find((block) => block.type === "text" && block.text);
                text = textBlock?.text;
            }
            else if (typeof excluded.content === "string") {
                text = excluded.content;
            }
            if (text) {
                const splitTexts = await textSplitter(text);
                const numSplits = splitTexts.length;
                if (partialStrategy === "last") {
                    splitTexts.reverse();
                }
                for (let _ = 0; _ < numSplits - 1; _ += 1) {
                    splitTexts.pop();
                    excluded.content = splitTexts.join("");
                    if ((await tokenCounter([...messagesCopy.slice(0, idx), excluded])) <=
                        maxTokens) {
                        if (partialStrategy === "last") {
                            excluded.content = [...splitTexts].reverse().join("");
                        }
                        messagesCopy = [...messagesCopy.slice(0, idx), excluded];
                        idx += 1;
                        break;
                    }
                }
            }
        }
    }
    if (endOn) {
        const endOnArr = Array.isArray(endOn) ? endOn : [endOn];
        while (idx > 0 && !_isMessageType(messagesCopy[idx - 1], endOnArr)) {
            idx -= 1;
        }
    }
    return messagesCopy.slice(0, idx);
}
async function _lastMaxTokens(messages, options) {
    const { allowPartial = false, includeSystem = false, endOn, startOn, ...rest } = options;
    // Create a copy of messages to avoid mutation
    let messagesCopy = messages.map((message) => {
        const fields = Object.fromEntries(Object.entries(message).filter(([k]) => k !== "type" && !k.startsWith("lc_")));
        return _switchTypeToMessage(message.getType(), fields, (0,_base_js__WEBPACK_IMPORTED_MODULE_2__.isBaseMessageChunk)(message));
    });
    if (endOn) {
        const endOnArr = Array.isArray(endOn) ? endOn : [endOn];
        while (messagesCopy.length > 0 &&
            !_isMessageType(messagesCopy[messagesCopy.length - 1], endOnArr)) {
            messagesCopy = messagesCopy.slice(0, -1);
        }
    }
    const swappedSystem = includeSystem && messagesCopy[0]?.getType() === "system";
    let reversed_ = swappedSystem
        ? messagesCopy.slice(0, 1).concat(messagesCopy.slice(1).reverse())
        : messagesCopy.reverse();
    reversed_ = await _firstMaxTokens(reversed_, {
        ...rest,
        partialStrategy: allowPartial ? "last" : undefined,
        endOn: startOn,
    });
    if (swappedSystem) {
        return [reversed_[0], ...reversed_.slice(1).reverse()];
    }
    else {
        return reversed_.reverse();
    }
}
const _MSG_CHUNK_MAP = {
    human: {
        message: _human_js__WEBPACK_IMPORTED_MODULE_5__.HumanMessage,
        messageChunk: _human_js__WEBPACK_IMPORTED_MODULE_5__.HumanMessageChunk,
    },
    ai: {
        message: _ai_js__WEBPACK_IMPORTED_MODULE_1__.AIMessage,
        messageChunk: _ai_js__WEBPACK_IMPORTED_MODULE_1__.AIMessageChunk,
    },
    system: {
        message: _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessage,
        messageChunk: _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessageChunk,
    },
    developer: {
        message: _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessage,
        messageChunk: _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessageChunk,
    },
    tool: {
        message: _tool_js__WEBPACK_IMPORTED_MODULE_8__.ToolMessage,
        messageChunk: _tool_js__WEBPACK_IMPORTED_MODULE_8__.ToolMessageChunk,
    },
    function: {
        message: _function_js__WEBPACK_IMPORTED_MODULE_4__.FunctionMessage,
        messageChunk: _function_js__WEBPACK_IMPORTED_MODULE_4__.FunctionMessageChunk,
    },
    generic: {
        message: _chat_js__WEBPACK_IMPORTED_MODULE_3__.ChatMessage,
        messageChunk: _chat_js__WEBPACK_IMPORTED_MODULE_3__.ChatMessageChunk,
    },
    remove: {
        message: _modifier_js__WEBPACK_IMPORTED_MODULE_6__.RemoveMessage,
        messageChunk: _modifier_js__WEBPACK_IMPORTED_MODULE_6__.RemoveMessage, // RemoveMessage does not have a chunk class.
    },
};
function _switchTypeToMessage(messageType, fields, returnChunk) {
    let chunk;
    let msg;
    switch (messageType) {
        case "human":
            if (returnChunk) {
                chunk = new _human_js__WEBPACK_IMPORTED_MODULE_5__.HumanMessageChunk(fields);
            }
            else {
                msg = new _human_js__WEBPACK_IMPORTED_MODULE_5__.HumanMessage(fields);
            }
            break;
        case "ai":
            if (returnChunk) {
                let aiChunkFields = {
                    ...fields,
                };
                if ("tool_calls" in aiChunkFields) {
                    aiChunkFields = {
                        ...aiChunkFields,
                        tool_call_chunks: aiChunkFields.tool_calls?.map((tc) => ({
                            ...tc,
                            type: "tool_call_chunk",
                            index: undefined,
                            args: JSON.stringify(tc.args),
                        })),
                    };
                }
                chunk = new _ai_js__WEBPACK_IMPORTED_MODULE_1__.AIMessageChunk(aiChunkFields);
            }
            else {
                msg = new _ai_js__WEBPACK_IMPORTED_MODULE_1__.AIMessage(fields);
            }
            break;
        case "system":
            if (returnChunk) {
                chunk = new _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessageChunk(fields);
            }
            else {
                msg = new _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessage(fields);
            }
            break;
        case "developer":
            if (returnChunk) {
                chunk = new _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessageChunk({
                    ...fields,
                    additional_kwargs: {
                        ...fields.additional_kwargs,
                        __openai_role__: "developer",
                    },
                });
            }
            else {
                msg = new _system_js__WEBPACK_IMPORTED_MODULE_7__.SystemMessage({
                    ...fields,
                    additional_kwargs: {
                        ...fields.additional_kwargs,
                        __openai_role__: "developer",
                    },
                });
            }
            break;
        case "tool":
            if ("tool_call_id" in fields) {
                if (returnChunk) {
                    chunk = new _tool_js__WEBPACK_IMPORTED_MODULE_8__.ToolMessageChunk(fields);
                }
                else {
                    msg = new _tool_js__WEBPACK_IMPORTED_MODULE_8__.ToolMessage(fields);
                }
            }
            else {
                throw new Error("Can not convert ToolMessage to ToolMessageChunk if 'tool_call_id' field is not defined.");
            }
            break;
        case "function":
            if (returnChunk) {
                chunk = new _function_js__WEBPACK_IMPORTED_MODULE_4__.FunctionMessageChunk(fields);
            }
            else {
                if (!fields.name) {
                    throw new Error("FunctionMessage must have a 'name' field");
                }
                msg = new _function_js__WEBPACK_IMPORTED_MODULE_4__.FunctionMessage(fields);
            }
            break;
        case "generic":
            if ("role" in fields) {
                if (returnChunk) {
                    chunk = new _chat_js__WEBPACK_IMPORTED_MODULE_3__.ChatMessageChunk(fields);
                }
                else {
                    msg = new _chat_js__WEBPACK_IMPORTED_MODULE_3__.ChatMessage(fields);
                }
            }
            else {
                throw new Error("Can not convert ChatMessage to ChatMessageChunk if 'role' field is not defined.");
            }
            break;
        default:
            throw new Error(`Unrecognized message type ${messageType}`);
    }
    if (returnChunk && chunk) {
        return chunk;
    }
    if (msg) {
        return msg;
    }
    throw new Error(`Unrecognized message type ${messageType}`);
}
function _chunkToMsg(chunk) {
    const chunkType = chunk.getType();
    let msg;
    const fields = Object.fromEntries(Object.entries(chunk).filter(([k]) => !["type", "tool_call_chunks"].includes(k) && !k.startsWith("lc_")));
    if (chunkType in _MSG_CHUNK_MAP) {
        msg = _switchTypeToMessage(chunkType, fields);
    }
    if (!msg) {
        throw new Error(`Unrecognized message chunk class ${chunkType}. Supported classes are ${Object.keys(_MSG_CHUNK_MAP)}`);
    }
    return msg;
}
/**
 * The default text splitter function that splits text by newlines.
 *
 * @param {string} text
 * @returns A promise that resolves to an array of strings split by newlines.
 */
function defaultTextSplitter(text) {
    const splits = text.split("\n");
    return Promise.resolve([
        ...splits.slice(0, -1).map((s) => `${s}\n`),
        splits[splits.length - 1],
    ]);
}


/***/ }),

/***/ 465:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoveMessage: () => (/* binding */ RemoveMessage)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(359);

/**
 * Message responsible for deleting other messages.
 */
class RemoveMessage extends _base_js__WEBPACK_IMPORTED_MODULE_0__.BaseMessage {
    constructor(fields) {
        super({
            ...fields,
            content: "",
        });
        /**
         * The ID of the message to remove.
         */
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = fields.id;
    }
    _getType() {
        return "remove";
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            id: this.id,
        };
    }
}


/***/ }),

/***/ 466:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImagePromptTemplate: () => (/* binding */ ImagePromptTemplate)
/* harmony export */ });
/* harmony import */ var _prompt_values_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(355);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(369);
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(459);



/**
 * An image prompt template for a multimodal model.
 */
class ImagePromptTemplate extends _base_js__WEBPACK_IMPORTED_MODULE_1__.BasePromptTemplate {
    static lc_name() {
        return "ImagePromptTemplate";
    }
    constructor(input) {
        super(input);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain_core", "prompts", "image"]
        });
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "templateFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * Additional fields which should be included inside
         * the message content array if using a complex message
         * content.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.defineProperty(this, "additionalContentFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.template = input.template;
        this.templateFormat = input.templateFormat ?? this.templateFormat;
        this.validateTemplate = input.validateTemplate ?? this.validateTemplate;
        this.additionalContentFields = input.additionalContentFields;
        if (this.validateTemplate) {
            let totalInputVariables = this.inputVariables;
            if (this.partialVariables) {
                totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
            }
            (0,_template_js__WEBPACK_IMPORTED_MODULE_2__.checkValidTemplate)([
                { type: "image_url", image_url: this.template },
            ], this.templateFormat, totalInputVariables);
        }
    }
    _getPromptType() {
        return "prompt";
    }
    /**
     * Partially applies values to the prompt template.
     * @param values The values to be partially applied to the prompt template.
     * @returns A new instance of ImagePromptTemplate with the partially applied values.
     */
    async partial(values) {
        const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
        const newPartialVariables = {
            ...(this.partialVariables ?? {}),
            ...values,
        };
        const promptDict = {
            ...this,
            inputVariables: newInputVariables,
            partialVariables: newPartialVariables,
        };
        return new ImagePromptTemplate(promptDict);
    }
    /**
     * Formats the prompt template with the provided values.
     * @param values The values to be used to format the prompt template.
     * @returns A promise that resolves to a string which is the formatted prompt.
     */
    async format(values) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = {};
        for (const [key, value] of Object.entries(this.template)) {
            if (typeof value === "string") {
                formatted[key] = (0,_template_js__WEBPACK_IMPORTED_MODULE_2__.renderTemplate)(value, this.templateFormat, values);
            }
            else {
                formatted[key] = value;
            }
        }
        const url = values.url || formatted.url;
        const detail = values.detail || formatted.detail;
        if (!url) {
            throw new Error("Must provide either an image URL.");
        }
        if (typeof url !== "string") {
            throw new Error("url must be a string.");
        }
        const output = { url };
        if (detail) {
            output.detail = detail;
        }
        return output;
    }
    /**
     * Formats the prompt given the input values and returns a formatted
     * prompt value.
     * @param values The input values to format the prompt.
     * @returns A Promise that resolves to a formatted prompt value.
     */
    async formatPromptValue(values) {
        const formattedPrompt = await this.format(values);
        return new _prompt_values_js__WEBPACK_IMPORTED_MODULE_0__.ImagePromptValue(formattedPrompt);
    }
}


/***/ })

};
;
//# sourceMappingURL=2.extension.js.map