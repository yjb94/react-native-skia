#pragma once

#include "JsiSkData.h"
#include <jsi/jsi.h>

namespace RNSkia {

    using namespace facebook;

    class JsiSkDataFactory : public JsiSkHostObject {
    public:
        JSI_HOST_FUNCTION(fromURI) {
            auto jsiLocalUri = arguments[0].asString(runtime);
            auto localUri = jsiLocalUri.utf8(runtime);
            auto context = getContext();
            return react::createPromiseAsJSIValue(
                    runtime,
                    [context, localUri](jsi::Runtime &runtime,
                                        std::shared_ptr<react::Promise> promise) -> void {
                        // Create a stream operation - this will be run in a
                        // separate thread
                        context->performStreamOperation(
                                localUri,
                                [&runtime, context, promise,
                                        localUri](
                                        std::unique_ptr<SkStreamAsset> stream) -> void {
                                    // Schedule drawCallback on the Javascript thread
                                    auto result = SkData::MakeFromStream(stream.get(), stream->getLength());
                                    context->runOnJavascriptThread([&runtime, context, promise,
                                                                           localUri, result]() {
                                        promise->resolve(jsi::Object::createFromHostObject(
                                                runtime,
                                                std::make_shared<JsiSkData>(context,
                                                                                   result)));
                                    });
                        });
            });
        };

        JSI_HOST_FUNCTION(fromBytes) {
            auto array = arguments[0].asObject(runtime);
            jsi::ArrayBuffer buffer = array
                    .getProperty(runtime, jsi::PropNameID::forAscii(runtime, "buffer"))
                    .asObject(runtime)
                    .getArrayBuffer(runtime);

            auto data = SkData::MakeWithCopy(buffer.data(runtime), buffer.size(runtime));
            return jsi::Object::createFromHostObject(runtime,
                                                     std::make_shared<JsiSkData>(
                                                             getContext(), data));
        }

        JSI_HOST_FUNCTION(fromBase64) {
            auto base64 = arguments[0].asString(runtime);
            auto base64Str = base64.utf8(runtime);
            auto size = base64Str.size();

            // Calculate length
            size_t len;
            SkBase64::Decode(&base64.utf8(runtime).c_str()[0], size, nullptr, &len);

            // Create data object and decode
            auto data = SkData::MakeUninitialized(len);
            SkBase64::Decode(&base64.utf8(runtime).c_str()[0], size, data->writable_data(), &len);

            return jsi::Object::createFromHostObject(runtime,
                                                     std::make_shared<JsiSkData>(
                                                             getContext(), data));
        }

        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiSkDataFactory, fromURI),
                             JSI_EXPORT_FUNC(JsiSkDataFactory, fromBytes),
                             JSI_EXPORT_FUNC(JsiSkDataFactory, fromBase64))

        JsiSkDataFactory(std::shared_ptr<RNSkPlatformContext> context)
                : JsiSkHostObject(context) {}
    };

} // namespace RNSkia
