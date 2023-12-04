import PipeError from './PipeError';

type PipeHandlerType = () => (
  str: string,
  initialValueString?: string
) => string | number | boolean | null | undefined;
type PipeSupportedObject = null | Record<string, string>;
type PipeSupportedType =
  | null
  | string
  | string[]
  | PipeSupportedObject
  | Map<string | symbol, string>
  | Set<string>;

export default class Pipe {
  private argDelimiter = ':';
  private functionDelimiter = '|';
  private lastFilter = 'emptyStringToNull';

  handlers: Record<string, PipeHandlerType> = {
    required: () => (str: string, initialValueString?: string) => {
      if (!str) {
        throw new PipeError(`Required value is empty: ${initialValueString}`);
      }
      return str;
    },
    toNull: () => (str: string) => str || null,
    toInt: () => (str: string) => (str ? +str : 0),
    toBool: () => (str: string) =>
      str === 'true' ? true : str === 'false' ? false : !!str,
    emptyStringToNull: () => (str: string) => (str === '' ? null : str),
    upper: () => (str: string) => str.toUpperCase(),
    lower: () => (str: string) => str.toLowerCase(),
    trim: () => (str: string) => str.trim(),
    trimEnd: () => (str: string) => str.trimEnd(),
    trimStart: () => (str: string) => str.trimStart(),
    at:
      (index = 0) =>
      (str: string) =>
        str.at(index),
    startsWith:
      (searchString: string = ' ', position?: number) =>
      (str: string) =>
        str.startsWith(searchString, position),
    endsWith:
      (searchString: string = '!', length?: number) =>
      (str: string) =>
        str.endsWith(searchString, length),
    includes:
      (searchString: string = ' ', position?: number) =>
      (str: string) =>
        str.includes(searchString, position),
    indexOf:
      (searchValue: string = ' ', fromIndex?: number) =>
      (str: string) =>
        str.indexOf(searchValue, fromIndex),
    lastIndexOf:
      (searchValue: string = ' ', fromIndex?: number) =>
      (str: string) =>
        str.lastIndexOf(searchValue, fromIndex),
    repeat:
      (count = 2) =>
      (str: string) =>
        str.repeat(count),
    replace:
      (searchValue: string = '  ', replaceValue: string = ' ') =>
      (str: string) =>
        str.replace(searchValue, replaceValue),
    padStart:
      (length = 10, fillString = '.') =>
      (str: string) =>
        str.padStart(length, fillString),
    padEnd:
      (length = 10, fillString = '.') =>
      (str: string) =>
        str.padEnd(length, fillString)
  };

  public addHandler(name: string, handler: PipeHandlerType) {
    this.handlers[name] = handler;
    return this;
  }

  public removeHandler(name: string) {
    delete this.handlers[name];
    return this;
  }

  public getHandler(name: string) {
    return this.handlers[name];
  }

  public getHandlerNames() {
    return Object.keys(this.handlers);
  }

  public setArgDelimiter(delimiter: string) {
    this.argDelimiter = delimiter;
    return this;
  }

  public setFunctionDelimiter(delimiter: string) {
    this.functionDelimiter = delimiter;
    return this;
  }

  public setLastFilter(filter: string) {
    this.lastFilter = filter;
    return this;
  }

  private getFunctionFromString(functionString: string) {
    const [name, ...args] = functionString.split(this.argDelimiter);
    const handler = this.handlers[name as keyof typeof this.handlers];
    if (!handler) {
      return (x: string) => x;
    }
    return (x: string, str?: string) => handler(...(args as []))(x, str);
  }

  private checkLastFilter() {
    if (!this.lastFilter) {
      return false;
    }
    const [filter] = this.lastFilter.split(this.argDelimiter);
    return filter in this.handlers;
  }

  private pipes(functionStrings: string[]) {
    if (this.checkLastFilter()) {
      functionStrings.push(this.lastFilter);
    }
    return (initialValue: string, initialValueString?: string) =>
      functionStrings.reduce((currentValue, functionString) => {
        const fnc = this.getFunctionFromString(functionString);
        return fnc(currentValue, initialValueString) as string;
      }, initialValue);
  }

  public pipeString(line: string) {
    const [initialValue, ...functionStrings] = line.split(
      this.functionDelimiter
    );
    return this.pipes(functionStrings)(initialValue, initialValue);
  }

  public pipeMap(map: Map<string | symbol, string>, defaultInitialValue = '') {
    const result = new Map();
    map.forEach((value, key) => {
      result.set(key, this.pipeString(value) || defaultInitialValue);
    });
    return result;
  }

  public pipeObject(obj: PipeSupportedObject, defaultInitialValue = '') {
    if (!obj) {
      return obj;
    }
    const result: Record<string, string> = {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = this.pipeString(value) || defaultInitialValue;
    });
    return result;
  }

  public pipeArray(arr: string[], defaultInitialValue = ''): string[] {
    return arr.map((value) => this.pipeString(value) || defaultInitialValue);
  }

  public pipeSet(set: Set<string>, defaultInitialValue = ''): Set<string> {
    return new Set(this.pipeArray([...set], defaultInitialValue));
  }

  public pipe(
    source: PipeSupportedType,
    defaultInitialValue = ''
  ): PipeSupportedType {
    if (typeof source === 'string') {
      return this.pipeString(source);
    }
    if (!source) {
      return defaultInitialValue;
    }
    if (Array.isArray(source)) {
      return this.pipeArray(source, defaultInitialValue);
    }
    if (source instanceof Map) {
      return this.pipeMap(source, defaultInitialValue);
    }
    if (source instanceof Set) {
      return this.pipeSet(source, defaultInitialValue);
    }
    if (typeof source === 'object') {
      return this.pipeObject(source, defaultInitialValue);
    }
    return source;
  }
}
