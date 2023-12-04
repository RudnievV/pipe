import Pipe from '../src';
import PipeError from '../src/PipeError';

describe('Pipe', () => {
  const pipe = new Pipe();

  beforeEach(() => {
    pipe
      .setFunctionDelimiter('|')
      .setArgDelimiter(':')
      .setLastFilter('emptyStringToNull');
  });

  it('should work another function delimiter', () => {
    expect(pipe.setFunctionDelimiter(';').pipeString('1;toInt')).toBe(1);
  });

  it('should work another arg delimiter', () => {
    expect(pipe.setArgDelimiter(';').pipeString('1|padEnd;2')).toBe('1.');
  });

  it('should work with wrong handler', () => {
    expect(pipe.pipeString('1|wrongFilter')).toBe('1');
  });

  it('should work empty last handler', () => {
    expect(pipe.setLastFilter('').pipeString('1')).toBe('1');
  });

  it('should add new handler', () => {
    expect(
      pipe.addHandler('equalOne', () => () => 1).pipeString('|equalOne')
    ).toBe(1);
  });

  it('should remove handler', () => {
    expect(
      pipe
        .addHandler('equalOne', () => () => 1)
        .removeHandler('equalOne')
        .getHandler('equalOne')
    ).toBe(undefined);
  });

  it('should get handler', () => {
    expect(
      pipe.addHandler('equalOne', () => () => 1).getHandler('equalOne')
    ).not.toBe(undefined);
  });

  it('should get handler names', () => {
    const names = pipe.addHandler('equalOne', () => () => 1).getHandlerNames();
    expect(names.includes('at')).toEqual(true);
  });

  it('should be equal 1', () => {
    expect(pipe.pipeString('1|toInt')).toBe(1);
  });

  it('should required work', () => {
    expect(pipe.pipeString('1|required')).toBe('1');
  });

  it('should throw error PipeError', () => {
    expect(() => {
      pipe.pipeString('|required');
    }).toThrow(PipeError);
  });

  it('should be equal null', () => {
    expect(pipe.pipeString('|toNull')).toBe(null);
  });

  it('should be equal true', () => {
    expect(pipe.pipeString('true|toBool')).toBe(true);
  });

  it('should be equal false', () => {
    expect(pipe.pipeString('false|toBool')).toBe(false);
  });

  it('should be equal true', () => {
    expect(pipe.pipeString('1|toBool')).toBe(true);
  });

  it('should be equal false', () => {
    expect(pipe.pipeString('0|toInt|toBool')).toBe(false);
  });

  it('should trim', () => {
    expect(pipe.pipeString(' one |trim')).toBe('one');
  });

  it('should trimEnd', () => {
    expect(pipe.pipeString(' one |trimEnd')).toBe(' one');
  });

  it('should trimStart', () => {
    expect(pipe.pipeString(' one |trimStart')).toBe('one ');
  });

  it('should at', () => {
    expect(pipe.pipeString('one|at:1')).toBe('n');
  });

  it('should startsWith', () => {
    expect(pipe.pipeString('one|startsWith:o')).toBe(true);
  });

  it('should endsWith', () => {
    expect(pipe.pipeString('one|endsWith:e')).toBe(true);
  });

  it('should includes', () => {
    expect(pipe.pipeString('one|includes:n')).toBe(true);
  });

  it('should indexOf', () => {
    expect(pipe.pipeString('one|indexOf:n')).toBe(1);
  });

  it('should lastIndexOf', () => {
    expect(pipe.pipeString('onne|lastIndexOf:n')).toBe(2);
  });

  it('should repeat', () => {
    expect(pipe.pipeString('one|repeat:3')).toBe('oneoneone');
  });

  it('should replace', () => {
    expect(pipe.pipeString('one|replace:o:O')).toBe('One');
  });

  it('should replace', () => {
    expect(pipe.pipeString('one|replace:o:O')).toBe('One');
  });

  it('should upper', () => {
    expect(pipe.pipeString('a|upper')).toBe('A');
  });

  it('should lower', () => {
    expect(pipe.pipeString('A|lower')).toBe('a');
  });

  it('should padStart', () => {
    expect(pipe.pipeString('A|padStart:2:#')).toBe('#A');
  });

  it('should padEnd', () => {
    expect(pipe.pipeString('A|padEnd:2')).toBe('A.');
  });

  it('should work with Map', () => {
    const source = new Map([
      ['a', 'a|upper'],
      ['b', 'B|lower']
    ]);
    const result = pipe.pipeMap(source);
    expect(result.get('a')).toBe('A');
    expect(result.get('b')).toBe('b');
  });

  it('should work with Object', () => {
    const source = {
      a: 'a|upper',
      b: 'B|lower'
    };
    const result = pipe.pipeObject(source);
    expect(result?.a).toBe('A');
    expect(result?.b).toBe('b');
  });

  it('should work pipeObject with null', () => {
    expect(pipe.pipeObject(null, 'default')).toBe(null);
  });

  it('should work with Array', () => {
    const source = ['a|upper', 'B|lower'];
    const result = pipe.pipeArray(source);
    expect(result[0]).toBe('A');
    expect(result[1]).toBe('b');
  });

  it('should work with Set', () => {
    const source = new Set(['a|upper', 'B|lower']);
    const result = pipe.pipeSet(source);
    expect(result.has('A')).toBe(true);
    expect(result.has('b')).toBe(true);
  });

  it('should work pipe with string', () => {
    expect(pipe.pipe('a|upper')).toBe('A');
  });

  it('should work pipe with array', () => {
    const source = ['a|upper', 'B|lower'];
    const result = pipe.pipe(source) as string[];
    expect(result[0]).toBe('A');
    expect(result[1]).toBe('b');
  });

  it('should work pipe with object', () => {
    const source = {
      a: 'a|upper',
      b: 'B|lower'
    };
    const result = pipe.pipe(source) as Record<string, string>;
    expect(result.a).toBe('A');
    expect(result.b).toBe('b');
  });

  it('should work pipe with map', () => {
    const source = new Map([
      ['a', 'a|upper'],
      ['b', 'B|lower']
    ]);
    const result = pipe.pipe(source) as Map<string, string>;
    expect(result.get('a')).toBe('A');
    expect(result.get('b')).toBe('b');
  });

  it('should work pipe with set', () => {
    const source = new Set(['a|upper', 'B|lower']);
    const result = pipe.pipe(source) as Set<string>;
    expect(result.has('A')).toBe(true);
    expect(result.has('b')).toBe(true);
  });

  it('should work pipe with null', () => {
    expect(pipe.pipe(null, 'default')).toBe('default');
  });

  it('should chain work', () => {
    expect(pipe.pipe('1|toInt|toBool')).toBe(true);
  });
});
