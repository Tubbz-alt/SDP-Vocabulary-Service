/*
File generated by js-routes 1.3.3
Based on Rails routes of Vocabulary::Application
 */

(function() {
  var DeprecatedBehavior, NodeTypes, ParameterMissing, ReservedOptions, SpecialOptionsKey, Utils, createGlobalJsRoutesObject, defaults, root,
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  ParameterMissing = function(message) {
    this.message = message;
  };

  ParameterMissing.prototype = new Error();

  defaults = {
    prefix: "",
    default_url_options: {}
  };

  NodeTypes = {"GROUP":1,"CAT":2,"SYMBOL":3,"OR":4,"STAR":5,"LITERAL":6,"SLASH":7,"DOT":8};

  SpecialOptionsKey = "_options";

  DeprecatedBehavior = false;

  ReservedOptions = ['anchor', 'trailing_slash', 'host', 'port', 'protocol'];

  Utils = {
    default_serializer: function(object, prefix) {
      var element, i, j, key, len, prop, s;
      if (prefix == null) {
        prefix = null;
      }
      if (object == null) {
        return "";
      }
      if (!prefix && !(this.get_object_type(object) === "object")) {
        throw new Error("Url parameters should be a javascript hash");
      }
      s = [];
      switch (this.get_object_type(object)) {
        case "array":
          for (i = j = 0, len = object.length; j < len; i = ++j) {
            element = object[i];
            s.push(this.default_serializer(element, prefix + "[]"));
          }
          break;
        case "object":
          for (key in object) {
            if (!hasProp.call(object, key)) continue;
            prop = object[key];
            if ((prop == null) && (prefix != null)) {
              prop = "";
            }
            if (prop != null) {
              if (prefix != null) {
                key = prefix + "[" + key + "]";
              }
              s.push(this.default_serializer(prop, key));
            }
          }
          break;
        default:
          if (object != null) {
            s.push((encodeURIComponent(prefix.toString())) + "=" + (encodeURIComponent(object.toString())));
          }
      }
      if (!s.length) {
        return "";
      }
      return s.join("&");
    },
    custom_serializer: null,
    serialize: function(object) {
      if ((this.custom_serializer != null) && this.get_object_type(this.custom_serializer) === "function") {
        return this.custom_serializer(object);
      } else {
        return this.default_serializer(object);
      }
    },
    clean_path: function(path) {
      var last_index;
      path = path.split("://");
      last_index = path.length - 1;
      path[last_index] = path[last_index].replace(/\/+/g, "/");
      return path.join("://");
    },
    extract_options: function(number_of_params, args) {
      var last_el, options;
      last_el = args[args.length - 1];
      if ((args.length > number_of_params && last_el === void 0) || ((last_el != null) && "object" === this.get_object_type(last_el) && !this.looks_like_serialized_model(last_el))) {
        options = args.pop() || {};
        delete options[SpecialOptionsKey];
        return options;
      } else {
        return {};
      }
    },
    looks_like_serialized_model: function(object) {
      return !object[SpecialOptionsKey] && ("id" in object || "to_param" in object);
    },
    path_identifier: function(object) {
      var property;
      if (object === 0) {
        return "0";
      }
      if (!object) {
        return "";
      }
      property = object;
      if (this.get_object_type(object) === "object") {
        if ("to_param" in object) {
          if (object.to_param == null) {
            throw new ParameterMissing("Route parameter missing: to_param");
          }
          property = object.to_param;
        } else if ("id" in object) {
          if (object.id == null) {
            throw new ParameterMissing("Route parameter missing: id");
          }
          property = object.id;
        } else {
          property = object;
        }
        if (this.get_object_type(property) === "function") {
          property = property.call(object);
        }
      }
      return property.toString();
    },
    clone: function(obj) {
      var attr, copy, key;
      if ((obj == null) || "object" !== this.get_object_type(obj)) {
        return obj;
      }
      copy = obj.constructor();
      for (key in obj) {
        if (!hasProp.call(obj, key)) continue;
        attr = obj[key];
        copy[key] = attr;
      }
      return copy;
    },
    merge: function() {
      var tap, xs;
      xs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      tap = function(o, fn) {
        fn(o);
        return o;
      };
      if ((xs != null ? xs.length : void 0) > 0) {
        return tap({}, function(m) {
          var j, k, len, results, v, x;
          results = [];
          for (j = 0, len = xs.length; j < len; j++) {
            x = xs[j];
            results.push((function() {
              var results1;
              results1 = [];
              for (k in x) {
                v = x[k];
                results1.push(m[k] = v);
              }
              return results1;
            })());
          }
          return results;
        });
      }
    },
    normalize_options: function(parts, required_parts, default_options, actual_parameters) {
      var i, j, key, len, options, part, parts_options, result, route_parts, url_parameters, use_all_parts, value;
      options = this.extract_options(parts.length, actual_parameters);
      if (actual_parameters.length > parts.length) {
        throw new Error("Too many parameters provided for path");
      }
      use_all_parts = DeprecatedBehavior || actual_parameters.length > required_parts.length;
      parts_options = {};
      for (key in options) {
        if (!hasProp.call(options, key)) continue;
        use_all_parts = true;
        if (this.indexOf(parts, key) >= 0) {
          parts_options[key] = value;
        }
      }
      options = this.merge(defaults.default_url_options, default_options, options);
      result = {};
      url_parameters = {};
      result['url_parameters'] = url_parameters;
      for (key in options) {
        if (!hasProp.call(options, key)) continue;
        value = options[key];
        if (this.indexOf(ReservedOptions, key) >= 0) {
          result[key] = value;
        } else {
          url_parameters[key] = value;
        }
      }
      route_parts = use_all_parts ? parts : required_parts;
      i = 0;
      for (j = 0, len = route_parts.length; j < len; j++) {
        part = route_parts[j];
        if (i < actual_parameters.length) {
          if (!parts_options.hasOwnProperty(part)) {
            url_parameters[part] = actual_parameters[i];
            ++i;
          }
        }
      }
      return result;
    },
    build_route: function(parts, required_parts, default_options, route, full_url, args) {
      var options, parameters, result, url, url_params;
      args = Array.prototype.slice.call(args);
      options = this.normalize_options(parts, required_parts, default_options, args);
      parameters = options['url_parameters'];
      result = "" + (this.get_prefix()) + (this.visit(route, parameters));
      url = Utils.clean_path(result);
      if (options['trailing_slash'] === true) {
        url = url.replace(/(.*?)[\/]?$/, "$1/");
      }
      if ((url_params = this.serialize(parameters)).length) {
        url += "?" + url_params;
      }
      url += options.anchor ? "#" + options.anchor : "";
      if (full_url) {
        url = this.route_url(options) + url;
      }
      return url;
    },
    visit: function(route, parameters, optional) {
      var left, left_part, right, right_part, type, value;
      if (optional == null) {
        optional = false;
      }
      type = route[0], left = route[1], right = route[2];
      switch (type) {
        case NodeTypes.GROUP:
          return this.visit(left, parameters, true);
        case NodeTypes.STAR:
          return this.visit_globbing(left, parameters, true);
        case NodeTypes.LITERAL:
        case NodeTypes.SLASH:
        case NodeTypes.DOT:
          return left;
        case NodeTypes.CAT:
          left_part = this.visit(left, parameters, optional);
          right_part = this.visit(right, parameters, optional);
          if (optional && ((this.is_optional_node(left[0]) && !left_part) || ((this.is_optional_node(right[0])) && !right_part))) {
            return "";
          }
          return "" + left_part + right_part;
        case NodeTypes.SYMBOL:
          value = parameters[left];
          if (value != null) {
            delete parameters[left];
            return this.path_identifier(value);
          }
          if (optional) {
            return "";
          } else {
            throw new ParameterMissing("Route parameter missing: " + left);
          }
          break;
        default:
          throw new Error("Unknown Rails node type");
      }
    },
    is_optional_node: function(node) {
      return this.indexOf([NodeTypes.STAR, NodeTypes.SYMBOL, NodeTypes.CAT], node) >= 0;
    },
    build_path_spec: function(route, wildcard) {
      var left, right, type;
      if (wildcard == null) {
        wildcard = false;
      }
      type = route[0], left = route[1], right = route[2];
      switch (type) {
        case NodeTypes.GROUP:
          return "(" + (this.build_path_spec(left)) + ")";
        case NodeTypes.CAT:
          return "" + (this.build_path_spec(left)) + (this.build_path_spec(right));
        case NodeTypes.STAR:
          return this.build_path_spec(left, true);
        case NodeTypes.SYMBOL:
          if (wildcard === true) {
            return "" + (left[0] === '*' ? '' : '*') + left;
          } else {
            return ":" + left;
          }
          break;
        case NodeTypes.SLASH:
        case NodeTypes.DOT:
        case NodeTypes.LITERAL:
          return left;
        default:
          throw new Error("Unknown Rails node type");
      }
    },
    visit_globbing: function(route, parameters, optional) {
      var left, right, type, value;
      type = route[0], left = route[1], right = route[2];
      if (left.replace(/^\*/i, "") !== left) {
        route[1] = left = left.replace(/^\*/i, "");
      }
      value = parameters[left];
      if (value == null) {
        return this.visit(route, parameters, optional);
      }
      parameters[left] = (function() {
        switch (this.get_object_type(value)) {
          case "array":
            return value.join("/");
          default:
            return value;
        }
      }).call(this);
      return this.visit(route, parameters, optional);
    },
    get_prefix: function() {
      var prefix;
      prefix = defaults.prefix;
      if (prefix !== "") {
        prefix = (prefix.match("/$") ? prefix : prefix + "/");
      }
      return prefix;
    },
    route: function(parts_table, default_options, route_spec, full_url) {
      var j, len, part, parts, path_fn, ref, required, required_parts;
      required_parts = [];
      parts = [];
      for (j = 0, len = parts_table.length; j < len; j++) {
        ref = parts_table[j], part = ref[0], required = ref[1];
        parts.push(part);
        if (required) {
          required_parts.push(part);
        }
      }
      path_fn = function() {
        return Utils.build_route(parts, required_parts, default_options, route_spec, full_url, arguments);
      };
      path_fn.required_params = required_parts;
      path_fn.toString = function() {
        return Utils.build_path_spec(route_spec);
      };
      return path_fn;
    },
    route_url: function(route_defaults) {
      var hostname, port, protocol;
      if (typeof route_defaults === 'string') {
        return route_defaults;
      }
      protocol = route_defaults.protocol || Utils.current_protocol();
      hostname = route_defaults.host || window.location.hostname;
      port = route_defaults.port || (!route_defaults.host ? Utils.current_port() : void 0);
      port = port ? ":" + port : '';
      return protocol + "://" + hostname + port;
    },
    has_location: function() {
      return typeof window !== 'undefined' && typeof window.location !== 'undefined';
    },
    current_host: function() {
      if (this.has_location()) {
        return window.location.hostname;
      } else {
        return null;
      }
    },
    current_protocol: function() {
      if (this.has_location() && window.location.protocol !== '') {
        return window.location.protocol.replace(/:$/, '');
      } else {
        return 'http';
      }
    },
    current_port: function() {
      if (this.has_location() && window.location.port !== '') {
        return window.location.port;
      } else {
        return '';
      }
    },
    _classToTypeCache: null,
    _classToType: function() {
      var j, len, name, ref;
      if (this._classToTypeCache != null) {
        return this._classToTypeCache;
      }
      this._classToTypeCache = {};
      ref = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
      for (j = 0, len = ref.length; j < len; j++) {
        name = ref[j];
        this._classToTypeCache["[object " + name + "]"] = name.toLowerCase();
      }
      return this._classToTypeCache;
    },
    get_object_type: function(obj) {
      if (root.jQuery && (root.jQuery.type != null)) {
        return root.jQuery.type(obj);
      }
      if (obj == null) {
        return "" + obj;
      }
      if (typeof obj === "object" || typeof obj === "function") {
        return this._classToType()[Object.prototype.toString.call(obj)] || "object";
      } else {
        return typeof obj;
      }
    },
    indexOf: function(array, element) {
      if (Array.prototype.indexOf) {
        return array.indexOf(element);
      } else {
        return this.indexOfImplementation(array, element);
      }
    },
    indexOfImplementation: function(array, element) {
      var el, i, j, len, result;
      result = -1;
      for (i = j = 0, len = array.length; j < len; i = ++j) {
        el = array[i];
        if (el === element) {
          result = i;
        }
      }
      return result;
    }
  };

  createGlobalJsRoutesObject = function() {
    var namespace;
    namespace = function(mainRoot, namespaceString) {
      var current, parts;
      parts = (namespaceString ? namespaceString.split(".") : []);
      if (!parts.length) {
        return;
      }
      current = parts.shift();
      mainRoot[current] = mainRoot[current] || {};
      return namespace(mainRoot[current], parts.join("."));
    };
    namespace(root, "Routes");
    root.Routes = {
// api_form => /api/forms/:id(.:format)
  // function(id, options)
  api_form_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// api_question => /api/questions/:id(.:format)
  // function(id, options)
  api_question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"questions",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// api_questions => /api/questions(.:format)
  // function(options)
  api_questions_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"questions",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// api_valueSet => /api/valueSets/:id(.:format)
  // function(id, options)
  api_valueSet_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"valueSets",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// api_valueSets => /api/valueSets(.:format)
  // function(options)
  api_valueSets_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"valueSets",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// authentication => /authentications/:id(.:format)
  // function(id, options)
  authentication_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"authentications",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// authentications => /authentications(.:format)
  // function(options)
  authentications_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"authentications",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// cancel_user_registration => /users/cancel(.:format)
  // function(options)
  cancel_user_registration_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"cancel",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// comment => /comments/:id(.:format)
  // function(id, options)
  comment_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"comments",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// comments => /comments(.:format)
  // function(options)
  comments_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"comments",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// concept => /concepts/:id(.:format)
  // function(id, options)
  concept_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"concepts",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// concept_service_search => /concept_service/search(.:format)
  // function(options)
  concept_service_search_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"concept_service",false],[2,[7,"/",false],[2,[6,"search",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// concept_service_systems => /concept_service/systems(.:format)
  // function(options)
  concept_service_systems_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"concept_service",false],[2,[7,"/",false],[2,[6,"systems",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// concepts => /concepts(.:format)
  // function(options)
  concepts_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"concepts",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// destroy_user_session => /users/sign_out(.:format)
  // function(options)
  destroy_user_session_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"sign_out",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// edit_authentication => /authentications/:id/edit(.:format)
  // function(id, options)
  edit_authentication_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"authentications",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_comment => /comments/:id/edit(.:format)
  // function(id, options)
  edit_comment_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"comments",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_concept => /concepts/:id/edit(.:format)
  // function(id, options)
  edit_concept_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"concepts",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_form_question => /form_questions/:id/edit(.:format)
  // function(id, options)
  edit_form_question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"form_questions",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_question_response_set => /question_response_sets/:id/edit(.:format)
  // function(id, options)
  edit_question_response_set_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"question_response_sets",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_question_type => /question_types/:id/edit(.:format)
  // function(id, options)
  edit_question_type_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"question_types",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_response => /responses/:id/edit(.:format)
  // function(id, options)
  edit_response_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"responses",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_user_password => /users/password/edit(.:format)
  // function(options)
  edit_user_password_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"password",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// edit_user_registration => /users/edit(.:format)
  // function(options)
  edit_user_registration_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"edit",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// elasticsearch => /elasticsearch(.:format)
  // function(options)
  elasticsearch_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"elasticsearch",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// export_form => /forms/:id/export(.:format)
  // function(id, options)
  export_form_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"export",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// form => /forms/:id(.:format)
  // function(id, options)
  form_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// form_question => /form_questions/:id(.:format)
  // function(id, options)
  form_question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"form_questions",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// form_questions => /form_questions(.:format)
  // function(options)
  form_questions_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"form_questions",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// forms => /forms(.:format)
  // function(options)
  forms_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// landing => /landing(.:format)
  // function(options)
  landing_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"landing",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// landing_stats => /landing/stats(.:format)
  // function(options)
  landing_stats_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"landing",false],[2,[7,"/",false],[2,[6,"stats",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// my_forms => /my_forms(.:format)
  // function(options)
  my_forms_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"my_forms",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// my_questions => /my_questions(.:format)
  // function(options)
  my_questions_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"my_questions",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// my_response_sets => /my_response_sets(.:format)
  // function(options)
  my_response_sets_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"my_response_sets",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// new_authentication => /authentications/new(.:format)
  // function(options)
  new_authentication_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"authentications",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_comment => /comments/new(.:format)
  // function(options)
  new_comment_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"comments",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_concept => /concepts/new(.:format)
  // function(options)
  new_concept_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"concepts",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_form => /forms/new(.:format)
  // function(options)
  new_form_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_form_question => /form_questions/new(.:format)
  // function(options)
  new_form_question_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"form_questions",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_question => /questions/new(.:format)
  // function(options)
  new_question_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"questions",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_question_response_set => /question_response_sets/new(.:format)
  // function(options)
  new_question_response_set_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"question_response_sets",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_question_type => /question_types/new(.:format)
  // function(options)
  new_question_type_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"question_types",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_response => /responses/new(.:format)
  // function(options)
  new_response_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"responses",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_response_set => /response_sets/new(.:format)
  // function(options)
  new_response_set_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"response_sets",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_survey => /surveys/new(.:format)
  // function(options)
  new_survey_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"surveys",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_user_password => /users/password/new(.:format)
  // function(options)
  new_user_password_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"password",false],[2,[7,"/",false],[2,[6,"new",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// new_user_registration => /users/sign_up(.:format)
  // function(options)
  new_user_registration_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"sign_up",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// new_user_session => /users/sign_in(.:format)
  // function(options)
  new_user_session_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"sign_in",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// notifications => /notifications(.:format)
  // function(options)
  notifications_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"notifications",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// notifications_mark_read => /notifications/mark_read(.:format)
  // function(options)
  notifications_mark_read_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"notifications",false],[2,[7,"/",false],[2,[6,"mark_read",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// publish_form => /forms/:id/publish(.:format)
  // function(id, options)
  publish_form_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"publish",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// publish_question => /questions/:id/publish(.:format)
  // function(id, options)
  publish_question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"questions",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"publish",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// publish_response_set => /response_sets/:id/publish(.:format)
  // function(id, options)
  publish_response_set_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"response_sets",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"publish",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// publish_survey => /surveys/:id/publish(.:format)
  // function(id, options)
  publish_survey_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"surveys",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"publish",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// question => /questions/:id(.:format)
  // function(id, options)
  question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"questions",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// question_response_set => /question_response_sets/:id(.:format)
  // function(id, options)
  question_response_set_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"question_response_sets",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// question_response_sets => /question_response_sets(.:format)
  // function(options)
  question_response_sets_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"question_response_sets",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// question_type => /question_types/:id(.:format)
  // function(id, options)
  question_type_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"question_types",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// question_types => /question_types(.:format)
  // function(options)
  question_types_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"question_types",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// questions => /questions(.:format)
  // function(options)
  questions_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"questions",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// rails_info => /rails/info(.:format)
  // function(options)
  rails_info_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"rails",false],[2,[7,"/",false],[2,[6,"info",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// rails_info_properties => /rails/info/properties(.:format)
  // function(options)
  rails_info_properties_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"rails",false],[2,[7,"/",false],[2,[6,"info",false],[2,[7,"/",false],[2,[6,"properties",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// rails_info_routes => /rails/info/routes(.:format)
  // function(options)
  rails_info_routes_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"rails",false],[2,[7,"/",false],[2,[6,"info",false],[2,[7,"/",false],[2,[6,"routes",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// rails_mailers => /rails/mailers(.:format)
  // function(options)
  rails_mailers_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"rails",false],[2,[7,"/",false],[2,[6,"mailers",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// redcap_form => /forms/:id/redcap(.:format)
  // function(id, options)
  redcap_form_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"redcap",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// reply_to_comment => /comments/:id/reply_to(.:format)
  // function(id, options)
  reply_to_comment_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"comments",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"reply_to",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// response => /responses/:id(.:format)
  // function(id, options)
  response_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"responses",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// response_set => /response_sets/:id(.:format)
  // function(id, options)
  response_set_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"response_sets",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// response_sets => /response_sets(.:format)
  // function(options)
  response_sets_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"response_sets",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// response_types => /response_types(.:format)
  // function(options)
  response_types_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"response_types",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// responses => /responses(.:format)
  // function(options)
  responses_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"responses",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// revise_form => /forms/:id/revise(.:format)
  // function(id, options)
  revise_form_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"forms",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"revise",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// revise_question => /questions/:id/revise(.:format)
  // function(id, options)
  revise_question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"questions",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"revise",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// revise_response_set => /response_sets/:id/revise(.:format)
  // function(id, options)
  revise_response_set_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"response_sets",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"revise",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// revise_survey => /surveys/:id/revise(.:format)
  // function(id, options)
  revise_survey_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"surveys",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"revise",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// root => /
  // function(options)
  root_path: Utils.route([], {}, [7,"/",false]),
// surveillance_program => /surveillance_programs/:id(.:format)
  // function(id, options)
  surveillance_program_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"surveillance_programs",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// surveillance_programs => /surveillance_programs(.:format)
  // function(options)
  surveillance_programs_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"surveillance_programs",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// surveillance_system => /surveillance_systems/:id(.:format)
  // function(id, options)
  surveillance_system_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"surveillance_systems",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// surveillance_systems => /surveillance_systems(.:format)
  // function(options)
  surveillance_systems_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"surveillance_systems",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// survey => /surveys/:id(.:format)
  // function(id, options)
  survey_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"surveys",false],[2,[7,"/",false],[2,[3,"id",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// surveys => /surveys(.:format)
  // function(options)
  surveys_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"surveys",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// usage_api_question => /api/questions/:id/usage(.:format)
  // function(id, options)
  usage_api_question_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"questions",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"usage",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]]]),
// usage_api_valueSet => /api/valueSets/:id/usage(.:format)
  // function(id, options)
  usage_api_valueSet_path: Utils.route([["id",true],["format",false]], {}, [2,[7,"/",false],[2,[6,"api",false],[2,[7,"/",false],[2,[6,"valueSets",false],[2,[7,"/",false],[2,[3,"id",false],[2,[7,"/",false],[2,[6,"usage",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]]]),
// user_openid_connect_omniauth_authorize => /users/auth/openid_connect(.:format)
  // function(options)
  user_openid_connect_omniauth_authorize_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"auth",false],[2,[7,"/",false],[2,[6,"openid_connect",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]),
// user_openid_connect_omniauth_callback => /users/auth/openid_connect/callback(.:format)
  // function(options)
  user_openid_connect_omniauth_callback_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"auth",false],[2,[7,"/",false],[2,[6,"openid_connect",false],[2,[7,"/",false],[2,[6,"callback",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]]]]]),
// user_password => /users/password(.:format)
  // function(options)
  user_password_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"password",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]]),
// user_registration => /users(.:format)
  // function(options)
  user_registration_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[1,[2,[8,".",false],[3,"format",false]],false]]]),
// user_session => /users/sign_in(.:format)
  // function(options)
  user_session_path: Utils.route([["format",false]], {}, [2,[7,"/",false],[2,[6,"users",false],[2,[7,"/",false],[2,[6,"sign_in",false],[1,[2,[8,".",false],[3,"format",false]],false]]]]])}
;
    root.Routes.options = defaults;
    root.Routes.default_serializer = function(object, prefix) {
      return Utils.default_serializer(object, prefix);
    };
    return root.Routes;
  };

  if (typeof define === "function" && define.amd) {
    define([], function() {
      return createGlobalJsRoutesObject();
    });
  } else {
    createGlobalJsRoutesObject();
  }

}).call(this);
